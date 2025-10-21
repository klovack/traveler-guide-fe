"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconShare } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export type ShareClipboardProps = {
  title?: string;
  message?: string;
  error?: {
    title?: string;
    message?: string;
  };
};

export function ShareClipboard(props: Readonly<ShareClipboardProps>) {
  const clipboard = useClipboard({ timeout: 500 });
  const t = useTranslations("common.share");

  const handleCopy = () => {
    const currentUrl = globalThis?.location.href;
    if (!currentUrl) {
      showErrorNotification();
      return;
    }

    clipboard.copy(currentUrl);
  };

  const showErrorNotification = () => {
    notifications.show({
      color: "red",
      title: props.error?.title ?? t("linkCopyError"),
      message: props.error?.message ?? t("linkCopiedDescriptionError"),
    });
  };

  const showSuccessNotification = () => {
    notifications.show({
      title: props.title ?? t("linkCopied"),
      message: props.message ?? t("linkCopiedDescription"),
    });
  };

  useEffect(() => {
    if (clipboard.copied) {
      showSuccessNotification();
    }
  }, [clipboard.copied]);

  useEffect(() => {
    if (clipboard.error) {
      showErrorNotification();
    }
  }, [clipboard.error]);

  return (
    <Tooltip label={t("copyLink")}>
      <ActionIcon variant="subtle" onClick={handleCopy}>
        <IconShare />
      </ActionIcon>
    </Tooltip>
  );
}
