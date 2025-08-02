"use client";

import DestinationMap from "./DestinationMap";
import PreferencesFields from "./PreferencesFields";
import { TripWizardFormValues, useTripWizard } from "../_hooks/useTripWizard";
import { Button, Flex } from "@mantine/core";
import DateRangePicker from "./DateRangePicker";
import { useTranslations } from "next-intl";

export type TripWizardFormProps = {
  onSubmit?: () => void;
};

export default function TripWizardForm({
  onSubmit,
}: Readonly<TripWizardFormProps>) {
  const { form } = useTripWizard();
  const t = useTranslations("TripWizardPage.preferences");

  const onSubmitForm = (data: TripWizardFormValues) => {
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
      <DateRangePicker />
      <DestinationMap />
      <PreferencesFields />
      <Flex justify="flex-end" align="center">
        <Button type="submit">{t("form.submitButton")}</Button>
      </Flex>
    </form>
  );
}
