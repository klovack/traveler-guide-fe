"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@mantine/core";
import Link from "next/link";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Link href="/">
      <Button variant="subtle" onClick={logout}>
        Logout
      </Button>
      ,
    </Link>
  );
}
