"use client";
import { AppAuthError, AppError } from "@/errors";
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
} from "tg-sdk";

type AuthContextType = {
  user?: AuthUserInfo;
  isLoggingIn: boolean;
  isFetchingMe: boolean;
  isRegistering: boolean;
  register: (credentials: RegisterInput) => Promise<void>;
  login: (credentials: LoginInput) => Promise<AuthUserInfo | undefined>;
  isLoggedIn: () => boolean;
  fetchMe: (shouldThrow: boolean) => Promise<AuthUserInfo | undefined>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUserInfo | undefined>();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [isFetchingMe, setIsFetchingMe] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);

  const handleError = (error: unknown) => {
    if ((error as AppAuthErrorHttpResponse)?.code) {
      const err = error as AppAuthErrorHttpResponse;
      return new AppAuthError(err.detail, err.code);
    }
    return new AppError(
      `${"An unexpected error during authentication occurred."}`
    );
  };

  const fetchMe = async (shouldThrow = false) => {
    setIsFetchingMe(true);

    try {
      const response = await getCurrentUserApiV1AuthMeGet({});
      if (!response.data) {
        throw new Error("No user data found");
      }

      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(undefined);
      if (shouldThrow) {
        throw handleError(error);
      }
    } finally {
      setIsFetchingMe(false);
    }
  };

  const login = async (credentials: LoginInput) => {
    setIsLoggingIn(true);

    try {
      const response = await loginUserApiV1AuthLoginPost({
        body: credentials,
      });

      if (!response.data && response.error) {
        throw response.error;
      }

      return await fetchMe(true);
    } catch (error) {
      setUser(undefined);
      throw handleError(error);
    } finally {
      setIsLoggingIn(false);
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
    setIsRegistering(true);

    try {
      const response = await registerUserApiV1AuthRegisterPost({
        body: credentials,
      });

      if (!response.data && response.error) {
        throw response.error;
      }
    } catch (error) {
      setUser(undefined);
      handleError(error);
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    fetchMe().catch();
  }, []);

  const providerValue: AuthContextType = React.useMemo(
    () => ({
      user,
      isLoggingIn,
      isFetchingMe,
      isRegistering,
      fetchMe,
      logout,
      login,
      register,
      isLoggedIn: () => !!user && !!user.id && !!user.role,
    }),
    [
      user,
      isLoggingIn,
      fetchMe,
      logout,
      login,
      register,
      isFetchingMe,
      isRegistering,
    ]
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
