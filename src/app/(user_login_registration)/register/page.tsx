"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm, isEmail, matchesField, isNotEmpty } from "@mantine/form";
import { TextInput, Text, Checkbox } from "@mantine/core";
import { useMemo, useState } from "react";
import { withoutAuthOnly } from "@/lib/withoutAuthOnly";
import LoginRegisterForm from "../_components/loginRegisterForm";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createRedirectUrl } from "@/lib/redirectUrl";
import { usePostAuthRedirectUrl } from "@/hooks/usePostRedirectUrl";

function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [authError, setAuthError] = useState<string | undefined>();
  const { register, isRegistering } = useAuth({ noAutoFetchMe: true });
  const redirectTo = usePostAuthRedirectUrl();
  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      termsOfService: false,
    },
    validate: {
      email: (value) => {
        const emailRequired = isNotEmpty(
          t("shared.emailInput.validationError.required")
        )(value);
        if (emailRequired) return emailRequired;

        const emailInvalid = isEmail(
          t("shared.emailInput.validationError.invalid")
        )(value);
        if (emailInvalid) return emailInvalid;
      },
      password: (value) => {
        const isLessThanMinLength =
          value.length < 8
            ? t("shared.passwordInput.validationError.minLength")
            : undefined;

        const isMissingUppercase = !/[A-Z]/.test(value)
          ? t("shared.passwordInput.validationError.uppercase")
          : undefined;

        const isMissingLowercase = !/[a-z]/.test(value)
          ? t("shared.passwordInput.validationError.lowercase")
          : undefined;

        const isMissingNumber = !/\d/.test(value)
          ? t("shared.passwordInput.validationError.number")
          : undefined;

        const errors = [
          isLessThanMinLength,
          isMissingUppercase,
          isMissingLowercase,
          isMissingNumber,
        ].filter((val) => val !== undefined && val !== null);

        return errors.length > 0
          ? t("shared.passwordInput.validationError.message", {
              criteria: errors.join(", "),
            })
          : undefined;
      },
      passwordConfirmation: matchesField(
        "password",
        t("shared.confirmPasswordInput.validationError.mismatch")
      ),
    },
  });

  async function handleRegister() {
    try {
      await register({
        email: form.values.email,
        password: form.values.password,
        password_confirmation: form.values.passwordConfirmation,
      });

      // Redirect to email confirmation page after successful registration, preserving redirectTo
      const emailConfirmationUrl = redirectTo
        ? createRedirectUrl(redirectTo, "/email-confirmation")
        : "/email-confirmation";
      router.replace(emailConfirmationUrl);
    } catch (error) {
      // Handle authentication error
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred during registration.");
      }
      console.error("Registration error:", error);
    }
  }

  function handleClose() {
    setAuthError(undefined);
  }

  const errors = useMemo(() => {
    return [authError, ...Object.values(form.errors)].filter(
      (error) => error !== undefined && error !== null
    );
  }, [authError, form.errors]);

  const TermsLink = (chunks: React.ReactNode) => (
    <Link href={"/terms"}>{chunks}</Link>
  );

  const PrivacyPolicyLink = (chunks: React.ReactNode) => (
    <Link href={"/privacy-policy"}>{chunks}</Link>
  );

  return (
    <LoginRegisterForm
      title={t("RegisterPage.title")}
      form={form}
      onSubmit={handleRegister}
      onErrorClose={handleClose}
      errors={errors}
      submitText={t("RegisterPage.submitButton")}
      textLink={{
        text: t("RegisterPage.textLink.text"),
        linkText: t("RegisterPage.textLink.linkText"),
        href: redirectTo ? createRedirectUrl(redirectTo, "/login") : "/login",
        linkStyle: { textDecoration: "none" },
      }}
      loading={isRegistering}
    >
      <Text>{t("RegisterPage.description")}</Text>
      <TextInput
        label={t("shared.emailInput.label")}
        placeholder={t("shared.emailInput.placeholder")}
        key={form.key("email")}
        required
        {...form.getInputProps("email")}
        errorProps={{
          style: { display: "none" },
        }}
      />
      <TextInput
        label={t("shared.passwordInput.label")}
        placeholder={t("shared.passwordInput.placeholder")}
        type="password"
        key={form.key("password")}
        required
        className="mt-4"
        {...form.getInputProps("password")}
        errorProps={{
          style: { display: "none" },
        }}
      />
      <TextInput
        label={t("shared.confirmPasswordInput.label")}
        placeholder={t("shared.confirmPasswordInput.placeholder")}
        type="password"
        key={form.key("passwordConfirmation")}
        required
        className="mt-4"
        {...form.getInputProps("passwordConfirmation")}
        errorProps={{
          style: { display: "none" },
        }}
      />

      <Checkbox
        key={form.key("termsOfService")}
        {...form.getInputProps("termsOfService", {
          type: "checkbox",
        })}
        label={t.rich("RegisterPage.termsAndConditions", {
          terms: TermsLink,
          privacyPolicy: PrivacyPolicyLink,
        })}
      />
    </LoginRegisterForm>
  );
}

export default withoutAuthOnly(RegisterPage);
