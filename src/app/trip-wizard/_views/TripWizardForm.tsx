"use client";

import DestinationMap from "../_components/DestinationMap";
import PreferencesFields from "../_components/PreferencesFields";
import { useTripWizardForm } from "../_hooks/useTripWizardForm";
import { Button, Collapse, Flex, Image, Overlay } from "@mantine/core";
import DateRangePicker from "../_components/DateRangePicker";
import { useLocale, useTranslations } from "next-intl";
import { LanguagesEnum, TripWizardRequest } from "tg-sdk";
import { useDisclosure } from "@mantine/hooks";
import { useGenerateTripWizard } from "@/hooks/useTripWizard";
import "@/lib/animations/flash.css";
import { BRAND_COLOR } from "@/lib/mantine/themes";

export type TripWizardFormProps = {
  onSubmit?: (tripWizardId: string) => void;
};

export default function TripWizardForm({
  onSubmit,
}: Readonly<TripWizardFormProps>) {
  const { form } = useTripWizardForm();
  const t = useTranslations("TripWizardPage.preferences");
  const locale = useLocale();
  const [mapOpened, { open: openMap }] = useDisclosure();
  const [preferenceOpened, { open: openPreference }] = useDisclosure();
  const { mutate, isPending } = useGenerateTripWizard();

  const onSubmitForm = (data: TripWizardRequest) => {
    if (isPending) return;

    mutate(
      {
        ...data,
        options: {
          response_language:
            data.options?.response_language ?? (locale as LanguagesEnum),
          ...data.options,
        },
      },
      {
        onSuccess(tripWizard) {
          onSubmit?.(tripWizard.id);
        },
      }
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitForm, (er) => {
        // TODO: handle error with toast notification
        console.log("FORM", form.getValues());
        console.log("ERROR", er);
      })}
      className="space-y-6"
    >
      <DateRangePicker onDateSelected={() => openMap()} />

      <Collapse my="15vh" in={!mapOpened}>
        <Image
          src="/assets/mascots/mimi_planning_itinerary.png"
          alt="Mascot planning an itinerary"
          h={200}
          fit="contain"
        />
      </Collapse>

      <Collapse in={mapOpened}>
        <DestinationMap onDestinationSelected={() => openPreference()} />
      </Collapse>

      <Collapse in={preferenceOpened}>
        <PreferencesFields />
        <Flex mt="xl" justify="flex-end" align="center">
          <Button
            loading={isPending}
            loaderProps={{ type: "dots" }}
            type="submit"
          >
            {t("form.submitButton")}
          </Button>
        </Flex>
      </Collapse>

      {isPending && (
        <Overlay
          color={BRAND_COLOR[0]}
          backgroundOpacity={0.55}
          blur={6}
          style={{
            position: "fixed",
          }}
        >
          <Image
            style={{ animation: "flash 5s linear 0s infinite normal forwards" }}
            src="/assets/mascots/mimi_look_at_globe.png"
            alt="Mascot typing on laptop"
            h={250}
            fit="contain"
            mx="auto"
            mt="20vh"
          />
        </Overlay>
      )}
    </form>
  );
}
