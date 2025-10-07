import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AppShell, AppShellMain, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "./_components/Navbar";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import QueryProvider from "@/components/QueryProvider";
import { theme } from "@/lib/mantine/themes";
import { HEIGHT_IN_PX } from "@/constants/layout";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Guide Platform",
  description: "Discover amazing travel destinations and guides",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={nunito.className}>
        <NextIntlClientProvider>
          <QueryProvider>
            <AuthProvider>
              <MantineProvider theme={theme}>
                <AppShell
                  header={{
                    height: HEIGHT_IN_PX.HEADER,
                  }}
                >
                  <Navbar />
                  <AppShellMain style={{ maxWidth: "100vw" }}>
                    {children}
                  </AppShellMain>
                </AppShell>
              </MantineProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
