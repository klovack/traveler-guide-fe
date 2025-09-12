"use client";
import Link from "next/link";
import { Button } from "@mantine/core";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

const noTextDecoration = { textDecoration: "none" };

export default function Navlinks() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn()) {
    return <LogoutButton key="nav-logout" />;
  }

  return (
    <>
      <Link key="nav-login" href="/login" style={noTextDecoration}>
        <Button variant="subtle">Login</Button>
      </Link>
      <Link key="nav-register" href="/register" style={noTextDecoration}>
        <Button variant="subtle">Sign Up</Button>
      </Link>
    </>
  );
}
