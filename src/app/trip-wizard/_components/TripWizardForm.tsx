"use client";

import DestinationMap from "./DestinationMap";
import PreferencesFields from "./PreferencesFields";
import { useTripWizardForm } from "../_hooks/useTripWizardForm";
import { Button, Collapse, Flex } from "@mantine/core";
import DateRangePicker from "./DateRangePicker";
import { useTranslations } from "next-intl";
import { TripWizardRequest } from "tg-sdk";
import { useDisclosure } from "@mantine/hooks";

export type TripWizardFormProps = {
  onSubmit?: () => void;
};

export default function TripWizardForm({
  onSubmit,
}: Readonly<TripWizardFormProps>) {
  const { form } = useTripWizardForm();
  const t = useTranslations("TripWizardPage.preferences");
  const [mapOpened, { open: openMap }] = useDisclosure();
  const [preferenceOpened, { open: openPreference }] = useDisclosure();

  const onSubmitForm = (data: TripWizardRequest) => {
    // Later: call FastAPI /ai/trip-suggestions
    console.log("Trip preferences:", data);
    onSubmit?.();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitForm, (er) => {
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
          <Button type="submit">{t("form.submitButton")}</Button>
        </Flex>
      </Collapse>
    </form>
  );
}
