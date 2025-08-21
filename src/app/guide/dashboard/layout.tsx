"use client";

import { AppShell, NavLink, Title } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

export default function GuideDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: false },
      }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Title order={4} mb="md">
          Guide Dashboard
        </Title>
        <NavLink
          label="Profile"
          component={Link}
          href="/guide/dashboard/profile"
        />
        <NavLink
          label="Availability"
          component={Link}
          href="/guide/dashboard/availability"
        />
        <NavLink
          label="Bookings"
          component={Link}
          href="/guide/dashboard/bookings"
        />
        <NavLink
          label="Earnings"
          component={Link}
          href="/guide/dashboard/earnings"
        />
        <NavLink
          label="Support"
          component={Link}
          href="/guide/dashboard/support"
        />
        <NavLink
          label="Reviews"
          component={Link}
          href="/guide/dashboard/reviews"
        />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
