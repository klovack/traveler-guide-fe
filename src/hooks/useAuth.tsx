"use client";
import { AppAuthError, AppError } from "@/errors";
import React from "react";
import {
  AuthUserInfo,
  getCurrentUserApiV1AuthMeGet,
  logoutUserApiV1AuthLogoutPost,
  loginUserApiV1AuthLoginPost,
  LoginInput,
  AppAuthErrorHttpResponse,
  RegisterInput,
  registerUserApiV1AuthRegisterPost,
} from "tg-sdk";

type AuthContextType = {
  user?: AuthUserInfo;
  isLoading: boolean;
  register: (credentials: RegisterInput) => Promise<AuthUserInfo | undefined>;
  login: (credentials: LoginInput) => Promise<AuthUserInfo | undefined>;
  isLoggedIn: () => boolean;
  fetchMe: () => Promise<AuthUserInfo | undefined>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUserInfo | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = (error: unknown) => {
    if ((error as AppAuthErrorHttpResponse)?.code) {
      const err = error as AppAuthErrorHttpResponse;
      console.error("Auth Error Response:", err);
      return new AppAuthError(err.detail, err.code);
    }
    console.error("Unknown Error:", error);
    return new AppError(
      `${"An unexpected error during authentication occurred."}`
    );
  };

  const fetchMe = async () => {
    setIsLoading(true);

    try {
      const response = await getCurrentUserApiV1AuthMeGet({});
      if (!response.data) {
        throw new Error("No user data found");
      }

      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(undefined);
      throw handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);

    try {
      const response = await loginUserApiV1AuthLoginPost({
        body: credentials,
      });

      if (!response.data && response.error) {
        throw response.error;
      }

      return await fetchMe();
    } catch (error) {
      setUser(undefined);
      throw handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await logoutUserApiV1AuthLogoutPost({
        credentials: "include",
      });

      if (response.response.status === 200) {
        setUser(undefined);
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const register = async (credentials: RegisterInput) => {
    setIsLoading(true);

    try {
      const response = await registerUserApiV1AuthRegisterPost({
        body: credentials,
      });

      if (!response.data && response.error) {
        throw response.error;
      }

      return await fetchMe();
    } catch (error) {
      setUser(undefined);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const providerValue: AuthContextType = React.useMemo(
    () => ({
      user,
      isLoading,
      fetchMe,
      logout,
      isLoggedIn: () => !!user && !!user.id && !!user.role,
      login,
      register,
    }),
    [user, isLoading, fetchMe]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
