import { NavLink, Stack } from "@mantine/core";
import Link from "next/link";

export function GuideSidebar() {
  return (
    <Stack>
      <NavLink
        component={Link}
        href="/guide/dashboard/profile"
        label="Profile"
      />
      <NavLink
        component={Link}
        href="/guide/dashboard/availability"
        label="Availability"
      />
      <NavLink
        component={Link}
        href="/guide/dashboard/bookings"
        label="Bookings"
      />
      <NavLink
        component={Link}
        href="/guide/dashboard/earnings"
        label="Earnings"
      />
      <NavLink
        component={Link}
        href="/guide/dashboard/support"
        label="Support"
      />
      <NavLink
        component={Link}
        href="/guide/dashboard/reviews"
        label="Reviews"
      />
    </Stack>
  );
}
