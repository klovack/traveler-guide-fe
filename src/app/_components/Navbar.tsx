import {
  AppShellHeader,
  Group,
  Avatar,
  Text,
  Button,
  CSSProperties,
} from "@mantine/core";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { requireUser } from "@/lib/auth.server";
import LocaleSwitcher from "./LocaleSwitcher";

export default async function Navbar() {
  const user = await requireUser({ shouldRedirect: false });
  const noTextDecoration: CSSProperties = {
    textDecoration: "none",
  };

  const navLinks = user
    ? [<LogoutButton key={"nav-logout"} />]
    : [
        <Link key={"nav-login"} href={"/login"} style={noTextDecoration}>
          <Button variant="subtle">Login</Button>
        </Link>,
        <Link key={"nav-register"} href={"/register"} style={noTextDecoration}>
          <Button variant="subtle">Sign Up</Button>
        </Link>,
      ];

  return (
    <AppShellHeader>
      <Group h="100%" px="md" justify="space-between">
        <Link href="/" style={noTextDecoration}>
          <Group>
            <Avatar />
            <Text className="hidden md:block" c="blue">
              Travel Guide Platform (Working Name)
            </Text>
          </Group>
        </Link>

        <Group h="100%">
          <LocaleSwitcher />
          {navLinks}
        </Group>
      </Group>
    </AppShellHeader>
  );
}
