"use client";

import DestinationMap from "../_components/DestinationMap";
import PreferencesFields from "../_components/PreferencesFields";
import { useTripWizardForm } from "../_hooks/useTripWizardForm";
import { Button, Collapse, Flex } from "@mantine/core";
import DateRangePicker from "../_components/DateRangePicker";
import { useLocale, useTranslations } from "next-intl";
import { LanguagesEnum, TripWizardRequest } from "tg-sdk";
import { useDisclosure } from "@mantine/hooks";
import { useGenerateTripWizard } from "@/hooks/useTripWizard";

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
    </form>
  );
}
