"use client";
import { AppAuthError, AppError } from "@/errors";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  AuthUserInfo,
  getCurrentUserApiV1AuthMeGet,
  logoutUserApiV1AuthLogoutPost,
  loginUserApiV1AuthLoginPost,
  LoginInput,
  AppAuthErrorHttpResponse,
  RegisterInput,
  registerUserApiV1AuthRegisterPost,
  BaseAuthOutput,
  RegisterOutput,
} from "tg-sdk";

type AuthContextType = {
  user?: AuthUserInfo;
  isLoggingIn: boolean;
  isFetchingMe: boolean;
  isRegistering: boolean;
  register: (credentials: RegisterInput) => Promise<RegisterOutput | undefined>;
  login: (credentials: LoginInput) => Promise<BaseAuthOutput | undefined>;
  isLoggedIn: () => boolean;
  fetchMe: (shouldThrow: boolean) => Promise<AuthUserInfo | undefined>;
  logout: () => Promise<void>;
};

export type UseAuthOptions = {
  /**
   * If true, will not automatically fetch the current user on mount.
   * This is useful if you want to control when the user data is fetched,
   * for example, if you want to fetch it only after a successful login or registration.
   */
  noAutoFetchMe?: boolean;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const useFetchMe = () =>
    useQuery<AuthUserInfo, AppError>({
      queryKey: ["me"],
      queryFn: async () => {
        const res = await getCurrentUserApiV1AuthMeGet();
        if (res.error) {
          const errAny = res.error as any;
          const msg =
            typeof errAny === "string"
              ? errAny
              : errAny?.detail || JSON.stringify(errAny) || "API error";
          throw new AppAuthError(msg, "api");
        }
        if (!res.data) throw new AppAuthError("No data returned", "api");
        return res.data;
      },
      enabled: false,
      retry: false,
    });

  const useLogin = () => {
    return useMutation<BaseAuthOutput, AppAuthError, LoginInput>({
      mutationFn: async (credentials: LoginInput) => {
        const res = await loginUserApiV1AuthLoginPost({ body: credentials });
        if (res.error) {
          const errAny = res.error as any;
          const msg =
            typeof errAny === "string"
              ? errAny
              : errAny?.detail || JSON.stringify(errAny) || "API error";
          const type = (errAny as AppAuthErrorHttpResponse)?.code || "api";
          throw new AppAuthError(msg, type);
        }
        if (!res.data) throw new AppAuthError("No data returned", "api");
        return res.data;
      },
      retry: false,
    });
  };

  const useRegister = () =>
    useMutation<RegisterOutput, AppAuthError, RegisterInput>({
      mutationFn: async (credentials: RegisterInput) => {
        const res = await registerUserApiV1AuthRegisterPost({
          body: credentials,
        });
        if (res.error) {
          const errAny = res.error as any;
          const msg =
            typeof errAny === "string"
              ? errAny
              : errAny?.detail || JSON.stringify(errAny) || "API error";
          const type = (errAny as AppAuthErrorHttpResponse)?.code || "api";
          throw new AppAuthError(msg, type);
        }
        if (!res.data) throw new AppAuthError("No data returned", "api");
        return res.data;
      },
      retry: false,
    });

  const useLogout = () => {
    return useMutation<void, AppError>({
      mutationFn: async () => {
        const res = await logoutUserApiV1AuthLogoutPost();
        if (res.error) {
          const errAny = res.error as any;
          const msg =
            typeof errAny === "string"
              ? errAny
              : errAny?.detail || JSON.stringify(errAny) || "API error";
          throw new AppError(msg);
        }
      },
      retry: false,
    });
  };

  const fetchMeQuery = useFetchMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const logout = async () => {
    return new Promise<void>((resolve, reject) => {
      logoutMutation.mutate(undefined, {
        onSuccess: () => resolve(),
        onError: (err) => reject(err),
      });
    });
  };

  const fetchMe = async (shouldThrow: boolean) => {
    try {
      const data = await fetchMeQuery.refetch();
      if (data.error && shouldThrow) throw data.error;
      return data.data;
    } catch (err) {
      if (shouldThrow) throw err;
      return undefined;
    }
  };

  const login = async (credentials: LoginInput) => {
    return new Promise<BaseAuthOutput | undefined>((resolve, reject) => {
      loginMutation.mutate(credentials, {
        onSuccess: (data) => resolve(data),
        onError: (err) => reject(err),
      });
    });
  };

  const register = async (credentials: RegisterInput) => {
    return new Promise<RegisterOutput | undefined>((resolve, reject) => {
      registerMutation.mutate(credentials, {
        onSuccess: (data) => resolve(data),
        onError: (err) => reject(err),
      });
    });
  };

  const providerValue = React.useMemo<AuthContextType>(
    () => ({
      user: fetchMeQuery.data,
      isLoggingIn: loginMutation.isPending,
      isFetchingMe: fetchMeQuery.isLoading,
      isRegistering: registerMutation.isPending,
      fetchMe,
      logout,
      login,
      register,
      isLoggedIn: () =>
        !!fetchMeQuery.data &&
        !!fetchMeQuery.data.id &&
        !!fetchMeQuery.data.role,
    }),
    [
      fetchMeQuery.data,
      fetchMeQuery.isLoading,
      loginMutation.isPending,
      registerMutation.isPending,
      fetchMeQuery.refetch,
      logoutMutation.mutate,
      loginMutation.mutate,
      registerMutation.mutate,
    ]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ({ noAutoFetchMe = false }: UseAuthOptions = {}) => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  useEffect(() => {
    if (!noAutoFetchMe && !context.isFetchingMe && !context.isLoggedIn()) {
      context.fetchMe(false).catch();
    }
  }, []);

  return context;
};
