import {
  Box,
  Container,
  Text,
  Title,
  Stack,
  Group,
  Divider,
  Anchor,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const footerLinks = [
    { label: "about", href: "#" },
    { label: "blog", href: "#" },
    { label: "contact", href: "#" },
    { label: "help", href: "#" },
    { label: "privacy", href: "#" },
    { label: "terms", href: "#" },
  ];

  const socialLinks = [
    { icon: IconBrandInstagram, href: "#", label: "instagram" },
    { icon: IconBrandX, href: "#", label: "x" },
    { icon: IconBrandFacebook, href: "#", label: "facebook" },
    { icon: IconBrandTiktok, href: "#", label: "tiktok" },
  ];

  return (
    <Box
      component="footer"
      bg="gray.0"
      style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
    >
      <Container size="xl" px="md" py="xl">
        <Stack align="center" gap="xl">
          {/* Logo/Brand */}
          <Stack align="center" gap="xs">
            <Title order={3} size="h3">
              {t("brand")}
            </Title>
            <Text c="dimmed" ta="center">
              {t("tagline")}
            </Text>
          </Stack>

          <Divider w={96} />

          {/* Links */}
          <Group justify="center" gap="xl" wrap="wrap">
            {footerLinks.map((link) => (
              <Anchor
                key={link.label}
                href={link.href}
                c="dimmed"
                td="none"
                style={{
                  "&:hover": {
                    color: "var(--mantine-color-text)",
                  },
                }}
              >
                {t(`links.${link.label}`)}
              </Anchor>
            ))}
          </Group>

          {/* Social Icons */}
          <Group gap="md">
            {socialLinks.map((social) => (
              <Tooltip label={t(`socials.${social.label}`)} key={social.label}>
                <ActionIcon
                  component="a"
                  href={social.href}
                  variant="subtle"
                  color="gray"
                  size="lg"
                  aria-label={t(`socials.${social.label}`)}
                >
                  <social.icon size={20} />
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>

          {/* Copyright */}
          <Text size="sm" c="dimmed" ta="center">
            {t("copyright", { year: new Date().getFullYear() })}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
