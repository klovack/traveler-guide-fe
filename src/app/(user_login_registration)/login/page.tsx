"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm, isEmail } from "@mantine/form";
import { Alert, Button, List, Stack, TextInput, Title } from "@mantine/core";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | undefined>();
  const { login } = useAuth();
  const searchParams = useSearchParams();

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

      // TODO: Remove this when all users have valid passwords
      // This is a temporary solution to allow users to log in without password validation
      password: (value) => {
        if (searchParams.get("skip-password-validation")) {
          return undefined;
        }

        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/\d/.test(value)) {
          return "Password must contain at least one number";
        }

        return undefined;
      },
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

  const hasErrors = !!authError || Object.keys(form.errors).length > 0;

  return (
    <form
      onSubmit={form.onSubmit((values) => handleLogin(values))}
      className="max-w-md mx-auto p-4"
    >
      <Stack gap="md" justify="center" w="60vw">
        <Title order={1}>Login</Title>
        <TextInput
          label="Email"
          placeholder="your-email@your-domain.com"
          key={form.key("email")}
          required
          {...form.getInputProps("email")}
          error={undefined}
        />
        <TextInput
          label="Password"
          placeholder="your-super-secret-password"
          type="password"
          key={form.key("password")}
          required
          className="mt-4"
          {...form.getInputProps("password")}
          error={undefined}
        />
        {hasErrors && (
          <Alert
            variant="filled"
            color="red"
            withCloseButton
            onClose={handleClose}
          >
            <List>
              {!!authError && <List.Item>{authError}</List.Item>}
              {form.errors.email && <List.Item>{form.errors.email}</List.Item>}
              {form.errors.password && (
                <List.Item>{form.errors.password}</List.Item>
              )}
            </List>
          </Alert>
        )}
        <Button className="mt-4" variant="filled" fullWidth type="submit">
          Login
        </Button>
      </Stack>
    </form>
  );
}
