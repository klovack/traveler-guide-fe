import { TravelVibeControl } from "@/components/form/travelVibe/TravelVibeControl";
import {
  Paper,
  Group,
  ActionIcon,
  Switch,
  Collapse,
  Textarea,
} from "@mantine/core";
import { IconHeart, IconSend, IconShare } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useTripWizardRegenerateForm } from "../../_hooks/useTripWizardRegenerateForm";
import { TripWizardResponse } from "tg-sdk";

export type OverviewControlsProps = {
  tripWizard: TripWizardResponse;
  onRegenerateSend?: () => void;
  onRegenerateSuccess?: (data: TripWizardResponse) => void;
  onRegenerateError?: (error: any) => void;
};

export function OverviewControls(props: Readonly<OverviewControlsProps>) {
  const t = useTranslations("TripWizardPage.itinerary");
  const { form, send, isPending } = useTripWizardRegenerateForm(
    props.tripWizard
  );
  const [shouldGenerateItinerary, setShouldGenerateItinerary] =
    useState<boolean>(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);

  const handleSend = () => {
    send({
      onSuccess: props.onRegenerateSuccess,
      onError: props.onRegenerateError,
    });

    props.onRegenerateSend?.();
  };

  return (
    <Paper>
      <Group gap="md" wrap="wrap" justify="space-between">
        <Switch
          checked={shouldGenerateItinerary}
          onChange={() => setShouldGenerateItinerary((v) => !v)}
          label={t("actions.regenerateItinerary")}
        />

        <Group>
          <ActionIcon variant="subtle">
            <IconHeart />
          </ActionIcon>
          <ActionIcon variant="subtle">
            <IconShare />
          </ActionIcon>
        </Group>
      </Group>

      <Collapse mt="lg" in={shouldGenerateItinerary}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <TravelVibeControl
            value={form.watch("travel_vibe") ?? undefined}
            onChange={(value) => form.setValue("travel_vibe", value)}
          />
          <Textarea
            radius="xl"
            autosize
            size="lg"
            mt="md"
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            placeholder={t("itineraryRegeneration.placeholder")}
            value={form.watch("description") ?? undefined}
            onChange={(e) =>
              form.setValue("description", e.currentTarget.value)
            }
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            rightSection={
              <ActionIcon
                variant={isTextareaFocused ? "light" : "transparent"}
                size="lg"
                mr="md"
                radius="xl"
                onClick={handleSend}
              >
                <IconSend size={20} />
              </ActionIcon>
            }
          />
        </form>
      </Collapse>
    </Paper>
  );
}
