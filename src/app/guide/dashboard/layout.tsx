"use client";

import { Button, Container, Tabs, TabsList, TabsTab } from "@mantine/core";
import {
  IconBook,
  IconBubble,
  IconCalendar,
  IconDashboard,
  IconMoneybag,
  IconStar,
  IconToggleLeft,
  IconToggleRight,
  IconUser,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

export default function GuideDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTabOpen, setIsTabOpen] = useState(false);
  const tabListWidth = useMemo(() => {
    return isTabOpen ? 200 : 60;
  }, [isTabOpen]);

  return (
    <>
      <Tabs
        value={pathname.split("/")[-1]}
        onChange={(value) => {
          if (value === "dashboard") {
            value = "";
          } else if (value === "toggle") {
            setIsTabOpen(!isTabOpen);
            return;
          }
          router.push(`/guide/dashboard/${value}`);
        }}
        variant="default"
        orientation="vertical"
        defaultValue="dashboard"
        className="absolute left-0 top-15 h-dvh z-10"
        style={{
          maxHeight: "calc(100vh - 60px)",
          transition: "width 0.3s",
        }}
      >
        <TabsList bg="white" w={tabListWidth}>
          {[
            {
              value: "dashboard",
              icon: <IconDashboard size={20} />,
              label: "Dashboard",
            },
            {
              value: "profile",
              icon: <IconUser size={20} />,
              label: "Profile",
            },
            {
              value: "availability",
              icon: <IconCalendar size={20} />,
              label: "Availability",
            },
            {
              value: "bookings",
              icon: <IconBook size={20} />,
              label: "Bookings",
            },
            {
              value: "earnings",
              icon: <IconMoneybag size={20} />,
              label: "Bookings",
            },
            {
              value: "support",
              icon: <IconBubble size={20} />,
              label: "Support",
            },
            {
              value: "reviews",
              icon: <IconStar size={20} />,
              label: "Reviews",
            },
          ].map((tab) => (
            <TabsTab key={tab.value} value={tab.value} leftSection={tab.icon}>
              {isTabOpen ? tab.label : null}
            </TabsTab>
          ))}

          <div className="grow" />

          <Button
            fullWidth
            variant="subtle"
            color="dark"
            onClick={() => setIsTabOpen(!isTabOpen)}
          >
            {!isTabOpen && <IconToggleLeft size={24} />}
            {isTabOpen && <IconToggleRight size={24} />}
          </Button>
        </TabsList>
      </Tabs>

      <Container
        className="min-h-dvh"
        onClick={() => setIsTabOpen(false)}
        mt="lg"
      >
        {children}
      </Container>
    </>
  );
}
