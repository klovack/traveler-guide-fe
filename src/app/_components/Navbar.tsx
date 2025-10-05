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
import { envVar } from "@/lib/utils/env";
import { COLOR } from "@/lib/mantine/themes";

export default function Navbar() {
  const noTextDecoration: CSSProperties = {
    textDecoration: "none",
  };

  const hideNextFeature = envVar.safeGet<boolean>("HIDE_NEXT_FEATURES");

  return (
    <AppShellHeader withBorder={false}>
      <Group h="100%" px="md" justify=" space-between">
        <Link href="/" style={noTextDecoration}>
          <Group>
            <Avatar />
            <Text className="hidden md:block" fw={700} c={COLOR.BRAND}>
              Mihape
            </Text>
          </Group>
        </Link>

        <Group h="100%">
          <LocaleSwitcher />
          {hideNextFeature ? null : <Navlinks />}
        </Group>
      </Group>
    </AppShellHeader>
  );
}
