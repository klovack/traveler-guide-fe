'use client';

import { Textarea, Collapse, Switch, Flex } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { TripWizardRequest } from "tg-sdk";
import { OptionalPreferencesFields } from "./PreferencesGroupFields";
import { useDisclosure } from "@mantine/hooks";
import { SelectGroupSize } from "@/components/form/groupSize/SelectGroupSize";
import { TravelVibeControl } from "@/components/form/travelVibe/TravelVibeControl";

export default function PreferencesFields() {
  const t = useTranslations("TripWizardPage.preferences");
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useFormContext<TripWizardRequest>();
  const [optionalPreferenceOpened, { toggle: toggleOptionalPreference }] =
    useDisclosure();

  return (
    <div className="space-y-4">
      <Flex maw="100%" justify="center" gap="md" wrap="wrap">
        <SelectGroupSize
          label={t("form.groupSize.label")}
          value={watch("group_size_details")}
          onChange={(value) => setValue("group_size_details", value)}
          style={{ flexGrow: 1 }}
          maw={{ base: "100%", sm: "40%" }}
          miw={300}
        />
        <TravelVibeControl
          style={{ flexGrow: 1 }}
          maw={{ base: "100%", sm: "60%" }}
          miw={300}
          label={t("form.vibe.label")}
          value={watch("travel_vibe")}
          onChange={(value) => setValue("travel_vibe", value)}
        />
      </Flex>

      <Textarea
        {...register("trip_description")}
        required
        label={t("form.description.label")}
        placeholder={t("form.description.placeholder")}
        rows={4}
        error={errors.trip_description?.message}
      />

      <Switch
        checked={optionalPreferenceOpened}
        onChange={() => toggleOptionalPreference()}
        label={t("form.addDetails.label")}
      />

      <Collapse in={optionalPreferenceOpened}>
        <OptionalPreferencesFields setValue={setValue} watch={watch} />
      </Collapse>
    </div>
  );
}
