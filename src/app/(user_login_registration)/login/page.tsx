"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { TextInput, Text } from "@mantine/core";
import { useState } from "react";
import { withoutAuthOnly } from "@/lib/withoutAuthOnly";
import LoginRegisterForm from "../_components/loginRegisterForm";
import { AppAuthError } from "@/errors";
import { useTranslations } from "next-intl";

function LoginPage() {
  const t = useTranslations("auth.LoginPage");
  const router = useRouter();
  const [authError, setAuthError] = useState<string | undefined>();
  const { login, isLoggingIn } = useAuth({ noAutoFetchMe: true });

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        const emailRequired = isEmail("Email is required")(value);
        if (emailRequired) return emailRequired;

        const emailInvalid = isEmail("Email must be valid")(value);
        if (emailInvalid) return emailInvalid;
      },
      password: isNotEmpty("Password is required"),
    },
  });

  async function handleLogin({ email, password }: typeof form.values) {
    try {
      const userData = await login({
        email,
        password,
      });

      if (userData) {
        // Redirect to home page after successful login
        router.replace("/dashboard");
      }
    } catch (error) {
      if (
        error instanceof AppAuthError &&
        error.code === "email_not_confirmed"
      ) {
        // Redirect to email confirmation page if email is not confirmed
        router.replace("/email-confirmation");
        return;
      }
      // Handle authentication error
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred during login.");
      }
      console.error("Login error:", error);
    }
  }

  function handleClose() {
    setAuthError(undefined);
    form.clearErrors();
  }

  const errors = [authError, ...Object.values(form.errors)].filter(
    (error) => error !== undefined && error !== null
  );

  return (
    <LoginRegisterForm
      title={t("title")}
      form={form}
      onSubmit={handleLogin}
      onErrorClose={handleClose}
      errors={errors}
      submitText={t("submitButton")}
      textLink={{
        text: t("textLink.text"),
        linkText: t("textLink.linkText"),
        href: "/register",
        linkStyle: { textDecoration: "none" },
      }}
      loading={isLoggingIn}
    >
      <Text>{t("description")}</Text>
      <TextInput
        label={t("emailInput.label")}
        placeholder={t("emailInput.placeholder")}
        key={form.key("email")}
        required
        {...form.getInputProps("email")}
        errorProps={{
          style: { display: "none" },
        }}
      />
      <TextInput
        label={t("passwordInput.label")}
        placeholder={t("passwordInput.placeholder")}
        type="password"
        key={form.key("password")}
        required
        className="mt-4"
        {...form.getInputProps("password")}
        errorProps={{
          style: { display: "none" },
        }}
      />
    </LoginRegisterForm>
  );
}

export default withoutAuthOnly(LoginPage);
