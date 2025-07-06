// TODO: Remove this once SSR is implemented
"use client";

import { withoutAuthOnly } from "@/lib/withoutAuthOnly";
import { Text, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import LoginRegisterForm from "../_components/loginRegisterForm";
import { useEffect, useRef, useState } from "react";
import { resendEmailConfirmationApiV1AuthResendEmailConfirmationPost } from "tg-sdk";

function EmailConfirmationPage() {
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
      title="Please confirm your email"
      form={form}
      onSubmit={handleEmailConfirmation}
      onErrorClose={() => form.clearErrors()}
      errors={form.errors ? Object.values(form.errors) : []}
      submitText="Confirm Email"
      disabled={isDisabled}
      textLink={{
        text: "Don't have an account?",
        linkText: "Register here",
        href: "/register",
        linkStyle: { textDecoration: "none" },
      }}
      loading={isSendingConfirmation}
    >
      <Text>
        Please check your email for a confirmation link. If you don't see it,
        please check your spam folder.{" "}
      </Text>

      <Text>
        If you still have not received the email, write your email below and
        click the button to resend the confirmation email.
      </Text>

      {isDisabled && (
        <Text c="red" size="sm">
          You can resend the confirmation email in{" "}
          {timer > 60
            ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                2,
                "0"
              )} minutes`
            : `${timer} seconds`}
          .
        </Text>
      )}
      <TextInput
        label="Email"
        placeholder="your-email@your-domain.com"
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
