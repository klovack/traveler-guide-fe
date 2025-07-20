'use client';

import {
  Group,
  RangeSlider,
  Stack,
  Textarea,
  Text,
  MultiSelect,
} from "@mantine/core";
import { useFormContext } from "react-hook-form";
import {
  interestOptions,
  languageOptions,
  TripWizardFormValues,
} from "../_hooks/useTripWizard";
import { useMemo } from "react";

export default function PreferencesFields() {
  const { register, watch, setValue } = useFormContext<TripWizardFormValues>();

  const groupSize = watch("groupSize");
  const groupSizeValue = useMemo<[number, number] | undefined>(() => {
    if (!groupSize) return;

    return [groupSize.min, groupSize.max];
  }, [groupSize]);

  const dailyBudget = watch("budget");
  const dailyBudgetValue = useMemo<[number, number] | undefined>(() => {
    if (!dailyBudget) return;

    return [dailyBudget.min, dailyBudget.max];
  }, [dailyBudget]);

  return (
    <div className="space-y-4">
      <Textarea
        {...register("tripDescription")}
        label="Tell us more about your dream trip?"
        placeholder="We’re a couple looking for a peaceful, nature-filled experience near the ocean. Avoid tourist traps."
        rows={4}
      />

      <Group w="100%" justify="center" grow gap="xl" className="mb-8">
        <Stack>
          <Text size="sm" fw={500}>
            Group size
          </Text>
          <RangeSlider
            label={(value) => `${value} ${value > 1 ? "Persons" : "Person"}`}
            min={1}
            max={10}
            minRange={0}
            maxRange={10}
            value={groupSizeValue}
            onChange={(val) =>
              setValue("groupSize", {
                min: val[0],
                max: val[1],
              })
            }
            marks={[
              { value: 1, label: "Solo" },
              { value: 5, label: "Small Group" },
              { value: 10, label: "Group" },
            ]}
          />
        </Stack>

        <Stack>
          <Text size="sm" fw={500}>
            Daily Budget
          </Text>
          <RangeSlider
            label={(value) => `$ ${value}`}
            step={10}
            min={100}
            max={1500}
            marks={[
              { value: 100, label: "$" },
              { value: 750, label: "$$" },
              { value: 1500, label: "$$$" },
            ]}
            value={dailyBudgetValue}
            onChange={(val) =>
              setValue("budget", {
                min: val[0],
                max: val[1],
              })
            }
          />
        </Stack>
      </Group>

      <Group w="100%" justify="center" grow gap="xl" align="flex-start">
        <MultiSelect
          label="Languages"
          placeholder="Select languages"
          data={Object.values(languageOptions).map((val) => val)}
          value={watch("languages")}
          onChange={(value) => setValue("languages", value)}
          searchable
          clearable
        />

        <MultiSelect
          label="Interests"
          placeholder="Select interests"
          data={Object.values(interestOptions).map((val) => val)}
          value={watch("interests")}
          onChange={(value) => setValue("interests", value)}
          searchable
          clearable
        />
      </Group>
    </div>
  );
}
