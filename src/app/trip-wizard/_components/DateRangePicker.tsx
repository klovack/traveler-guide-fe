import { Group, Select } from "@mantine/core";
import {
  DateFormatter,
  DatePickerInput,
  DatePickerInputProps,
} from "@mantine/dates";
import React, { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { envVar } from "@/lib/utils/env";
import { useFormContext } from "react-hook-form";
import {
  datesFlexibilityOptions,
  TripWizardFormValues,
} from "../_hooks/useTripWizard";
import { useTranslations } from "next-intl";

type TripType = "day" | "multiday" | "range";
const tripTypes: TripType[] = ["day", "multiday", "range"];

const MAX_NUM_OF_MULTI_DAYS_TRIP =
  envVar.safeGet<number>("NEXT_MAX_NUM_OF_MULTI_DAYS_TRIP") ?? 5;

export default function DateRangePicker() {
  const t = useTranslations("TripWizardPage.preferences.form");
  const { watch, setValue } = useFormContext<TripWizardFormValues>();
  const [rangeDateValue, setRangeDateValue] = useState<
    [string | null, string | null]
  >([null, null]);
  const [singleDateValue, setSingleDateValue] = useState<string | null>(null);
  const [multiDateValue, setMultiDateValue] = useState<string[]>([]);
  const [tripType, setTripType] = useState<TripType>("day");

  const today = useMemo(() => dayjs(), []);
  const placeholderTexts = useMemo(() => {
    const format = "MMMM D, YYYY";
    const todayFormatted = today.format(format);
    const twoDaysLater = today.add(3, "day").format(format);
    const sevenDaysLater = today.add(7, "day").format(format);

    return {
      day: todayFormatted,
      multiday: `${todayFormatted}, ${twoDaysLater}, ${sevenDaysLater}`,
      range: `${todayFormatted} - ${sevenDaysLater}`,
    } as Record<TripType, string>;
  }, [today]);

  const onTripChange = (val: string | null) => {
    if (!val) return;

    if (!tripTypes.includes(val as TripType)) return;
    setTripType(val as TripType);
  };

  const handleMultiDateChange = (val: string[]) => {
    if (val.length <= MAX_NUM_OF_MULTI_DAYS_TRIP) {
      setMultiDateValue(val);
      onDateChange(val as TripWizardFormValues["dates"]);
    }

    // TODO show error that the user can't select more than MAX_NUM_OF_MULTI_DAYS_TRIP
  };

  const multiDateFormatter: DateFormatter = ({
    type,
    date,
    locale,
    format,
  }) => {
    if (type === "multiple" && Array.isArray(date)) {
      if (date.length <= 3) {
        return date
          .map((d) => dayjs(d).locale(locale).format(format))
          .join(", ");
      }

      if (date.length > 3) {
        const firstDate = dayjs(date[0]).locale(locale).format(format);
        return `${firstDate} and ${date.length - 1} other dates selected`;
      }

      return "";
    }

    return "";
  };

  const onDateChange = useCallback((value: TripWizardFormValues["dates"]) => {
    setValue("dates", value);
  }, []);

  const getComponentByTripType = () => {
    const defaultAttributes: DatePickerInputProps = {
      className: "grow",
      label: t("travelDates.label"),
      flex: "grow",
      highlightToday: true,
      minDate: today.toDate(),
      maxDate: today.add(6, "month").toDate(),
      hideOutsideDates: true,
      clearable: true,
      maxLevel: "month",
      numberOfColumns: 2,
    };

    switch (tripType) {
      case "range":
        return (
          <DatePickerInput
            {...(defaultAttributes as unknown as DatePickerInputProps<"range">)}
            placeholder={placeholderTexts.range}
            type="range"
            value={rangeDateValue}
            onChange={(val) => {
              setRangeDateValue(val);
              if (!val || val.length !== 2) return;
              onDateChange({
                start: val[0] ?? "",
                end: val[1] ?? "",
              });
            }}
          />
        );
      case "multiday":
        return (
          <DatePickerInput
            {...(defaultAttributes as unknown as DatePickerInputProps<"multiple">)}
            placeholder={placeholderTexts.multiday}
            type="multiple"
            value={multiDateValue}
            onChange={handleMultiDateChange}
            valueFormatter={multiDateFormatter}
          />
        );
      case "day":
      default:
        return (
          <DatePickerInput
            {...defaultAttributes}
            placeholder={placeholderTexts.day}
            type="default"
            value={singleDateValue}
            onChange={(val) => {
              setSingleDateValue(val);
              onDateChange(val as TripWizardFormValues["dates"]);
            }}
          />
        );
    }
  };

  return (
    <Group
      justify="flex-start"
      align="flex-start"
      w="100%"
      maw="100%"
      wrap="wrap"
      h="100%"
    >
      <Select
        label={t("tripType.label")}
        data={tripTypes.map((type) => ({
          value: type,
          label: t(`tripType.options.${type}`),
        }))}
        value={tripType}
        onChange={onTripChange}
      />

      {getComponentByTripType()}

      <Select
        label="Flexibility"
        data={Object.entries(datesFlexibilityOptions).map(([key, label]) => ({
          value: key,
          label,
        }))}
        value={watch("datesFlexibility")}
        onChange={(value) => {
          if (!value) return;
          setValue(
            "datesFlexibility",
            value as keyof typeof datesFlexibilityOptions
          );
        }}
        defaultValue="exact"
        allowDeselect={false}
      />
    </Group>
  );
}
