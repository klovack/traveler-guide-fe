import { ComboboxData, Group, Select } from "@mantine/core";
import { DatePickerInput, DatePickerInputProps } from "@mantine/dates";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { TripWizardRequest } from "tg-sdk";
import { datesFlexibilityOptions } from "../_hooks/useTripWizardForm";
import { useMediaQuery } from "@mantine/hooks";
import { BREAKPOINTS } from "@/constants/breakpoints";

type TripType = "day" | "range";
const tripTypes: TripType[] = ["day", "range"];

type TripWizardDateRangePicker =
  | {
      type: "day";
      date?: string | null;
    }
  | {
      type: "range";
      date?: [string | null, string | null];
    };

function getTripTypeAndDatesFromValue(
  startDate: TripWizardRequest["start_date"],
  endDate: TripWizardRequest["end_date"]
): TripWizardDateRangePicker {
  if (!startDate) {
    return { type: "day", date: null };
  }

  if (!endDate || dayjs(startDate).isSame(endDate, "day")) {
    return { type: "day", date: startDate };
  }

  return {
    type: "range",
    date: [startDate, endDate],
  };
}

export type DateRangePickerProps = {
  onDateSelected?: (value: {
    start: string | null;
    end: string | null;
  }) => void;
};

export default function DateRangePicker({
  onDateSelected,
}: Readonly<DateRangePickerProps>) {
  const t = useTranslations("TripWizardPage.preferences.form");
  const locale = useLocale();
  const { watch, setValue } = useFormContext<TripWizardRequest>();
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const trip = getTripTypeAndDatesFromValue(startDate, endDate);
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md})`);

  const [rangeDateValue, setRangeDateValue] = useState<
    [string | null, string | null]
  >(trip.type === "range" && trip.date ? trip.date : [null, null]);
  const [singleDateValue, setSingleDateValue] = useState<string | null>(
    trip.type === "day" && trip.date ? trip.date : null
  );
  const [tripType, setTripType] = useState<TripType>(trip.type);

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

  const onDateChange = useCallback(
    ({ start, end }: { start?: string | null; end?: string | null }) => {
      if (start) {
        const startDateTime = dayjs(start);
        setValue("start_date", startDateTime.toISOString());
      }

      if (end) {
        const endDateTime = dayjs(end);
        setValue("end_date", endDateTime.toISOString());
      }
    },
    []
  );

  const notifyParent = () => {
    if (!startDate || !endDate) return;
    onDateSelected?.({
      start: startDate,
      end: endDate,
    });
  };

  // notify the parent if the trip dates is selected when mounting
  useEffect(() => {
    notifyParent();
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
      numberOfColumns: isMobile ? 1 : 2,
      onDropdownClose: notifyParent,
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
              onDateChange({ start: val, end: val });
            }}
          />
        );
    }
  };

  const datesFlexibilities: ComboboxData = useMemo(() => {
    return datesFlexibilityOptions.map((option) => ({
      value: option,
      label: t(`flexibleDates.options.${option}`),
    }));
  }, [datesFlexibilityOptions, t, locale]);

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
        allowDeselect={false}
        className={isMobile ? "w-full" : undefined}
      />

      {getComponentByTripType()}

      <Select
        label="Flexibility"
        data={datesFlexibilities}
        value={watch("dates_flexibility")}
        onChange={(value) => {
          if (!value) return;
          setValue(
            "dates_flexibility",
            value as TripWizardRequest["dates_flexibility"]
          );
        }}
        defaultValue="exact"
        allowDeselect={false}
        className={isMobile ? "w-full" : undefined}
      />
    </Group>
  );
}
