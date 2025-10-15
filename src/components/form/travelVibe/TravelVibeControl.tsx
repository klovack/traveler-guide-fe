import { BREAKPOINTS } from "@/constants/breakpoints";
import {
  Center,
  SegmentedControl,
  Stack,
  StackProps,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAirBalloon,
  IconCurrencyDollar,
  IconCurrencyDollarOff,
  IconFlameFilled,
  IconMassage,
  IconScale,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { zTripWizardTravelVibe, TripWizardTravelVibe } from "tg-sdk";

export type TravelVibeControlProps = Omit<StackProps, "onChange"> & {
  label?: string;
  required?: boolean;
  description?: string;
  value?: TripWizardTravelVibe;
  onChange?: (value: TripWizardTravelVibe) => void;
};

const zTripVibeEnum = zTripWizardTravelVibe.enum;
const traveVibeToIcon: Record<TripWizardTravelVibe, React.ReactNode> = {
  budget: <IconCurrencyDollarOff size={16} />,
  adventurous: <IconAirBalloon size={16} />,
  balanced: <IconScale size={16} />,
  intense: <IconFlameFilled size={16} />,
  relaxed: <IconMassage size={16} />,
  luxury: <IconCurrencyDollar size={16} />,
};

export function TravelVibeControl(props: Readonly<TravelVibeControlProps>) {
  const t = useTranslations();
  const { onChange, label, required, description, value, ...stackProps } =
    props;
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md})`, true);

  const data = Object.keys(traveVibeToIcon).map((value) => {
    const label = (
      <>
        {isMobile && (
          <Tooltip
            // @ts-ignore (target is valid, but not in the type definition)
            target={`#travel-vibe-option-${value}`}
            label={t("TripWizardPage.preferences.form.vibe.options." + value)}
            events={{ hover: true, focus: true, touch: true }}
            position="bottom"
            offset={10}
          />
        )}
        <Center id={`travel-vibe-option-${value}`}>
          {traveVibeToIcon[value as keyof typeof traveVibeToIcon]}
          {!isMobile && (
            <span>
              {t("TripWizardPage.preferences.form.vibe.options." + value)}
            </span>
          )}
        </Center>
      </>
    );
    return { label, value };
  });

  return (
    <Stack {...stackProps} gap={0}>
      <Stack gap={0}>
        <Text fw="500" size="sm">
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Text>
        {description && (
          <Text c="dimmed" size="xs">
            {description}
          </Text>
        )}
      </Stack>
      <SegmentedControl
        data={data}
        defaultValue="balanced"
        fullWidth
        value={value}
        onChange={(val) => props.onChange?.(val as TripWizardTravelVibe)}
      />
    </Stack>
  );
}
