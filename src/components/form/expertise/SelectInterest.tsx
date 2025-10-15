import { useMemo } from "react";
import { useCreateInterestMutation, useInterest } from "@/hooks/useInterest";
import { ChipSelector, ChipSelectorError } from "../ChipSelector";
import { useTranslations } from "next-intl";

export type SelectInterestProps = {
  label: string;
  placeholder?: string;
  description?: string;
  error?: ChipSelectorError;
  required?: boolean;
  value?: string[] | null;
  onChange?: (value: string[]) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function SelectInterest(props: Readonly<SelectInterestProps>) {
  const t = useTranslations();
  const { data: interests, isPending } = useInterest();
  const { mutate: addNewInterest } = useCreateInterestMutation();

  const normalizedValues = useMemo(() => {
    return new Set(props.value);
  }, [props.value]);

  const dataInterests = useMemo(() => {
    if (!interests) return [];

    return interests.items.map((interest) => ({
      ...interest,
      checked: normalizedValues.has(interest.id),
    }));
  }, [interests, normalizedValues]);

  const handleAddNewInterest = async (name: string) => {
    if (!name.trim()) return;

    // Check if interest exists
    const exists = interests?.items.find(
      (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (exists) {
      // Select the existing interest
      props.onChange?.([
        ...(props.value || []).filter((v) => v !== exists.id),
        exists.id,
      ]);
    } else {
      // Add new interest to database
      addNewInterest(name, {
        onSuccess: (data) => {
          props.onChange?.([...(props.value ?? []), data.id]);
        },
      });
    }
  };

  return (
    <ChipSelector
      label={props.label}
      description={props.description}
      error={props.error}
      required={props.required}
      value={props.value}
      onChange={props.onChange}
      min={props.min}
      max={props.max}
      items={dataInterests}
      onAddNew={handleAddNewInterest}
      addNewPlaceholder={
        props.placeholder ?? t("form.selectInterest.placeholder")
      }
      disabled={props.disabled}
      loading={isPending}
    />
  );
}
