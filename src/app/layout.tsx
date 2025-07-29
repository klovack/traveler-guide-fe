import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  AppShell,
  AppShellMain,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "./_components/Navbar";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Guide Platform",
  description: "Discover amazing travel destinations and guides",
};

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider>
          <AuthProvider>
            <MantineProvider theme={theme}>
              <AppShell
                header={{
                  height: 60,
                }}
                padding="md"
              >
                <Navbar />

                <AppShellMain>{children}</AppShellMain>
              </AppShell>
            </MantineProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
