import { Card, Center } from "@mantine/core";
import React from "react";

export default function UserLoginRegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Center>
      <Card radius="md" withBorder padding="lg">
        {children}
      </Card>
    </Center>
  );
}
