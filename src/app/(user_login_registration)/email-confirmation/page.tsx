"use client";

import { withoutAuthOnly } from "@/lib/withoutAuthOnly";
import { Text, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import LoginRegisterForm from "../_components/loginRegisterForm";
import { useEffect, useRef, useState } from "react";
import { resendEmailConfirmationApiV1AuthResendEmailConfirmationPost } from "tg-sdk";
import { useTranslations } from "next-intl";

function EmailConfirmationPage() {
  const t = useTranslations("auth.EmailConfirmationPage");
  const RESEND_WAIT_SECONDS = 120; // 2 minutes
  const [timer, setTimer] = useState(RESEND_WAIT_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSendingConfirmation, setIsSendingConfirmation] = useState(false);

  useEffect(() => {
    // Start timer on mount
    if (timer > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timer]);

  const handleEmailConfirmation = async (values: typeof form.values) => {
    setIsSendingConfirmation(true);
    try {
      const response =
        await resendEmailConfirmationApiV1AuthResendEmailConfirmationPost({
          body: {
            email: values.email,
          },
        });

      if (response.error || !response.data) {
        console.error("Failed to resend email confirmation:", response.error);
        return;
      }
    } catch (error) {
      console.error("Error confirming email:", error);
      return;
    } finally {
      setTimer(RESEND_WAIT_SECONDS);
      setIsSendingConfirmation(false);
    }
  };

  const isDisabled = timer > 0;

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => {
        const hasEmailError = isNotEmpty("Email is required")(value);
        const isEmailValid = isEmail("Email must be valid")(value);

        const errors = [hasEmailError, isEmailValid].filter(
          (val) => val !== undefined && val !== null
        );

        return errors.length > 0 ? errors.join(", ") : undefined;
      },
    },
  });

  return (
    <LoginRegisterForm
      title={t("title")}
      form={form}
      onSubmit={handleEmailConfirmation}
      onErrorClose={() => form.clearErrors()}
      errors={form.errors ? Object.values(form.errors) : []}
      submitText={t("submitButton")}
      disabled={isDisabled}
      textLink={{
        text: t("textLink.text"),
        linkText: t("textLink.linkText"),
        href: "/register",
        linkStyle: { textDecoration: "none" },
      }}
      loading={isSendingConfirmation}
    >
      <Text>{t("checkEmailAndSpam")}</Text>

      <Text>{t("resendEmailConfirmation")}</Text>

      {isDisabled && (
        <Text c="red" size="sm">
          {t("resendEmailConfirmationIn", {
            waitingTime:
              timer > 60
                ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                    2,
                    "0"
                  )} ${t("minutes")}`
                : `${timer} ${t("seconds")}`,
          })}
        </Text>
      )}
      <TextInput
        label={t("emailInput.label")}
        placeholder={t("emailInput.placeholder")}
        key={form.key("email")}
        required
        {...form.getInputProps("email")}
        error={undefined}
        disabled={isDisabled}
      />
    </LoginRegisterForm>
  );
}

export default withoutAuthOnly(EmailConfirmationPage);
