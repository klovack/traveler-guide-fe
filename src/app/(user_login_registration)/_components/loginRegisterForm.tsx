"use client";
import { UseFormReturnType } from "@mantine/form";
import { Alert, Button, List, Stack, Title, Text } from "@mantine/core";
import Link from "next/link";
import React, { useMemo } from "react";

export type LoginRegisterTextLinkProps = {
  text: string;
  linkText: string;
  href: string;
  linkStyle?: React.CSSProperties;
};

export type LoginRegisterFormProps<T> = {
  title?: React.ReactNode;
  form: UseFormReturnType<T>;
  errors?: React.ReactNode[];
  submitText: string;
  textLink?: LoginRegisterTextLinkProps;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onSubmit: (values: T) => Promise<void>;
  onErrorClose?: () => void;
};

export default function LoginRegisterForm<T>(props: LoginRegisterFormProps<T>) {
  const {
    form,
    onSubmit,
    onErrorClose,
    errors,
    title,
    submitText,
    children,
    disabled,
    loading,
  } = props;

  const handleErrorClose = () => {
    form.clearErrors();
    onErrorClose?.();
  };

  const hasErrors = errors && errors.length > 0;
  const errorMessages =
    errors && errors.length > 0
      ? errors.map((err) => <List.Item key={err?.toString()}>{err}</List.Item>)
      : null;
  const errorMessage = useMemo(
    () =>
      hasErrors && (
        <Alert
          variant="filled"
          color="red"
          withCloseButton
          onClose={handleErrorClose}
        >
          <List>{errorMessages}</List>
        </Alert>
      ),
    [hasErrors, errorMessages, handleErrorClose]
  );

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmit(values))}
      className="max-w-md mx-auto p-4"
    >
      <Stack gap="md" justify="center" w="40vw" miw="300px">
        {title && <Title order={1}>{title}</Title>}
        {children}
        {errorMessage}
        <Button
          disabled={disabled}
          className="mt-4"
          variant="filled"
          fullWidth
          type="submit"
          loading={loading}
        >
          {submitText}
        </Button>

        {props.textLink && (
          <Text>
            {props.textLink.text}{" "}
            <Link
              href={props.textLink.href}
              style={{ textDecoration: "none", ...props.textLink.linkStyle }}
            >
              {props.textLink.linkText}
            </Link>
          </Text>
        )}
      </Stack>
    </form>
  );
}
