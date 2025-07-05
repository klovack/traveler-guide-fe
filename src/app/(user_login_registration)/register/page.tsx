"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm, isEmail, matches, matchesField } from "@mantine/form";
import { Alert, Button, List, Stack, TextInput, Title } from "@mantine/core";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | undefined>();
  const { register } = useAuth();
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
      password: matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      ),
      passwordConfirmation: matchesField("password", "Passwords do not match"),
    },
  });

  async function handleRegister() {
    try {
      const userData = await register({
        email: form.values.email,
        password: form.values.password,
        password_confirmation: form.values.passwordConfirmation,
      });

      if (userData) {
        // Redirect to home page after successful login
        router.replace("/email-confirmation");
      }
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
    form.reset();
  }

  const hasErrors = !!authError || Object.keys(form.errors).length > 0;

  return (
    <form
      onSubmit={form.onSubmit(() => handleRegister())}
      className="max-w-md mx-auto p-4"
    >
      <Stack gap="md" justify="center" w="60vw">
        <Title order={1}>Register</Title>
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
        <TextInput
          label="Password Confirmation"
          placeholder="your-super-secret-password"
          type="password"
          key={form.key("passwordConfirmation")}
          required
          className="mt-4"
          {...form.getInputProps("passwordConfirmation")}
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
              {form.errors.passwordConfirmation && (
                <List.Item>{form.errors.passwordConfirmation}</List.Item>
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
