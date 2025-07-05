import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Avatar,
  Group,
  MantineProvider,
  Text,
  createTheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Guide Platform",
  description: "Discover amazing travel destinations and guides",
};

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MantineProvider theme={theme}>
            <AppShell
              header={{
                height: 60,
              }}
              padding="md"
            >
              <AppShellHeader>
                <Group h="100%" px="md">
                  <Avatar />
                  <Text>Travel Guide Platform (Working Name)</Text>
                </Group>
              </AppShellHeader>

              <AppShellMain>{children}</AppShellMain>
            </AppShell>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
