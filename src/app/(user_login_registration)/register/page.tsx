"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm, isEmail, matchesField } from "@mantine/form";
import { TextInput } from "@mantine/core";
import { useMemo, useState } from "react";
import { withoutAuthOnly } from "@/lib/withoutAuthOnly";
import LoginRegisterForm from "../_components/loginRegisterForm";

function RegisterPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | undefined>();
  const { register, isRegistering } = useAuth({ noAutoFetchMe: true });
  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: {
      email: (value) => {
        const emailRequired = isEmail("Email is required")(value);
        if (emailRequired) return emailRequired;

        const emailInvalid = isEmail("Email must be valid")(value);
        if (emailInvalid) return emailInvalid;
      },
      password: (value) => {
        const isLessThanMinLength =
          value.length < 8 ? "be at least 8 characters long" : undefined;

        const isMissingUppercase = !/[A-Z]/.test(value)
          ? "contain at least one uppercase letter"
          : undefined;

        const isMissingLowercase = !/[a-z]/.test(value)
          ? "contain at least one lowercase letter"
          : undefined;

        const isMissingNumber = !/\d/.test(value)
          ? "contain at least one number"
          : undefined;

        const errors = [
          isLessThanMinLength,
          isMissingUppercase,
          isMissingLowercase,
          isMissingNumber,
        ].filter((val) => val !== undefined && val !== null);

        return errors.length > 0
          ? `Password must ${errors.join(", ")}`
          : undefined;
      },
      passwordConfirmation: matchesField("password", "Passwords do not match"),
    },
  });

  async function handleRegister() {
    try {
      await register({
        email: form.values.email,
        password: form.values.password,
        password_confirmation: form.values.passwordConfirmation,
      });

      // Redirect to home page after successful registration
      router.replace("/email-confirmation");
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

  return (
    <LoginRegisterForm
      title="Register"
      form={form}
      onSubmit={handleRegister}
      onErrorClose={handleClose}
      errors={errors}
      submitText="Login"
      textLink={{
        text: "Already have an account?",
        linkText: "Login here",
        href: "/login",
        linkStyle: { textDecoration: "none" },
      }}
      loading={isRegistering}
    >
      <TextInput
        label="Email"
        placeholder="your-email@your-domain.com"
        key={form.key("email")}
        required
        {...form.getInputProps("email")}
        errorProps={{
          style: { display: "none" },
        }}
      />
      <TextInput
        label="Password"
        placeholder="your-super-secret-password"
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
        label="Password Confirmation"
        placeholder="your-super-secret-password"
        type="password"
        key={form.key("passwordConfirmation")}
        required
        className="mt-4"
        {...form.getInputProps("passwordConfirmation")}
        errorProps={{
          style: { display: "none" },
        }}
      />
    </LoginRegisterForm>
  );
}

export default withoutAuthOnly(RegisterPage);
