import { useMemo } from "react";
import {
  useCreatePersonalityMutation,
  usePersonality,
} from "@/hooks/usePersonality";
import { ChipSelector, ChipSelectorError } from "../ChipSelector";
import { useTranslations } from "next-intl";

export type SelectPersonalityProps = {
  label: string;
  description?: string;
  error?: ChipSelectorError;
  required?: boolean;
  value?: string[] | null;
  onChange?: (value: string[]) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function SelectPersonality(props: Readonly<SelectPersonalityProps>) {
  const t = useTranslations();
  const { data: personalities } = usePersonality();
  const { mutate: addNewPersonality } = useCreatePersonalityMutation();

  const normalizedValues = useMemo(() => {
    return new Set(props.value);
  }, [props.value]);

  const dataPersonalities = useMemo(() => {
    if (!personalities) return [];

    return personalities.items.map((personality) => ({
      ...personality,
      checked: normalizedValues.has(personality.id),
    }));
  }, [personalities, normalizedValues]);

  const handleAddNewPersonality = async (name: string) => {
    if (!name.trim()) return;

    // Check if personality exists
    const exists = personalities?.items.find(
      (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (exists) {
      // Select the existing personality
      props.onChange?.([
        ...(props.value || []).filter((v) => v !== exists.id),
        exists.id,
      ]);
    } else {
      // Add new personality to database
      addNewPersonality(name.toLowerCase().trim(), {
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
      items={dataPersonalities}
      onAddNew={handleAddNewPersonality}
      addNewPlaceholder={t("form.selectPersonality.placeholder")}
      disabled={props.disabled}
    />
  );
}
