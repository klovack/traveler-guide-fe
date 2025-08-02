import {
  AppShellHeader,
  Group,
  Avatar,
  Text,
  CSSProperties,
} from "@mantine/core";
import Link from "next/link";
import Navlinks from "./Navlinks";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar() {
  const noTextDecoration: CSSProperties = {
    textDecoration: "none",
  };

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
          <Navlinks />
        </Group>
      </Group>
    </AppShellHeader>
  );
}
