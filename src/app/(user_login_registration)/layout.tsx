import { Card, Center } from "@mantine/core";
import React from "react";
import Template from "./template";

export default function UserLoginRegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Center>
      <Card radius="md" withBorder padding="lg">
        <Template>{children}</Template>
      </Card>
    </Center>
  );
}
