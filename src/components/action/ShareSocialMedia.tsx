import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrandWhatsapp, IconBrandX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type createShareUrlFunc = (url: string, message?: string) => string;

type SocialMediaPlatform = {
  icon: React.ReactNode;
  getShareUrl: createShareUrlFunc;
};

type SupportedPlatforms = "whatsapp" | "x";

const supportedSocialMedia: Record<SupportedPlatforms, SocialMediaPlatform> = {
  whatsapp: {
    icon: <IconBrandWhatsapp />,
    getShareUrl: (url: string, message?: string) => {
      const encodedUrl = encodeURIComponent(url);
      const encodedMessage = message ? encodeURIComponent(message) : "";
      // WhatsApp `text` can include both message and URL
      const text = encodedMessage
        ? `${encodedMessage}%20${encodedUrl}`
        : encodedUrl;
      return `https://api.whatsapp.com/send?text=${text}`;
    },
  },
  x: {
    icon: <IconBrandX />,
    getShareUrl: (url: string, message?: string) => {
      const encodedUrl = encodeURIComponent(url);
      const encodedMessage = message ? encodeURIComponent(message) : "";
      // Twitter (X) supports `text` and `url` params
      return message
        ? `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`
        : `https://twitter.com/intent/tweet?url=${encodedUrl}`;
    },
  },
};

export type ShareSocialMediaProps = {
  platform: keyof typeof supportedSocialMedia;
  message?: string;
};

export function ShareSocialMedia(props: Readonly<ShareSocialMediaProps>) {
  const t = useTranslations("common.share");
  const handleShare = () => {
    const url = globalThis?.location.href;
    const shareUrl = supportedSocialMedia[props.platform].getShareUrl(
      url,
      props.message
    );
    globalThis.open(shareUrl, "_blank");
  };

  return (
    <Tooltip label={t(`platforms.${props.platform}`)}>
      <ActionIcon variant="subtle" onClick={handleShare}>
        {supportedSocialMedia[props.platform].icon}
      </ActionIcon>
    </Tooltip>
  );
}
