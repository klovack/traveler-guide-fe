import {
  Chip,
  Flex,
  Stack,
  Text,
  Button,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useState, useMemo } from "react";
import {
  useCreatePersonalityMutation,
  usePersonality,
} from "@/hooks/usePersonality";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export type SelectPersonalityProps = {
  label: string;
  description?: string;
  error?: {
    min?: string | boolean;
    max?: string | boolean;
    required?: string | boolean;
  };
  required?: boolean;
  value?: string[] | null;
  onChange?: (value: string[]) => void;
  min?: number;
  max?: number;
};

export function SelectPersonality(props: Readonly<SelectPersonalityProps>) {
  const t = useTranslations();
  const { data: personalities } = usePersonality();
  const [isAddingMore, setIsAddingMore] = useState<boolean>(false);
  const [newlyAdded, setNewlyAdded] = useState<string>("");
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

  const handleAddingNewPersonality = async (name: string) => {
    if (!name.trim()) return;

    // Check if personality exists
    const exists = personalities?.items.find(
      (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (exists) {
      // Set error and select the personality
      props.onChange?.([
        ...(props.value || []).filter((v) => v !== exists.id),
        exists.id,
      ]);
    } else {
      // Add new personality to database
      // After successful addition, get the new personality ID
      addNewPersonality(name, {
        onSuccess: (data) => {
          props.onChange?.([...(props.value ?? []), data.id]);
        },
      });
    }

    setIsAddingMore(false);
    setNewlyAdded("");
  };

  const isRequired = props.required || (props.min && props.min > 0);

  return (
    <Stack>
      <Stack gap={0}>
        <Text fw="bold">
          {props.label}
          {isRequired && <span style={{ color: "red" }}> *</span>}
        </Text>
        {props.description && (
          <Text c="dimmed" size="sm">
            {props.description}
          </Text>
        )}
      </Stack>
      <Flex maw="100%" gap="xs" wrap="wrap" align="center" justify="center">
        {dataPersonalities.map((personality) => (
          <Chip
            id={personality.id}
            checked={personality.checked}
            key={personality.id}
            value={personality.id}
            onChange={(checked) => {
              if (checked && props.max && props.value?.length === props.max) {
                return;
              }
              props.onChange?.([
                ...(props.value || []).filter((v) => v !== personality.id),
                ...(checked ? [personality.id] : []),
              ]);
            }}
          >
            {personality.name}
          </Chip>
        ))}
        {!isAddingMore && (
          <Button
            variant="default"
            rightSection={<IconPlus size={14} />}
            radius="xl"
            size="xs"
            onClick={() => setIsAddingMore(true)}
          >
            Add more
          </Button>
        )}
        {isAddingMore && (
          <TextInput
            variant="filled"
            size="xs"
            radius="xl"
            placeholder="Personality name"
            onChange={(e) => setNewlyAdded(e.currentTarget.value)}
            value={newlyAdded}
            rightSection={
              <ActionIcon
                size="sm"
                onClick={() => {
                  setIsAddingMore(false);
                  setNewlyAdded("");
                }}
                variant="subtle"
                radius="xl"
              >
                <IconX size={14} />
              </ActionIcon>
            }
            onKeyDown={async (e) => {
              if (e.key === "Enter" && newlyAdded?.trim()) {
                e.preventDefault();
                await handleAddingNewPersonality(newlyAdded.trim());

                return false;
              }
            }}
          />
        )}
      </Flex>
      {props.error && (
        <>
          {props.error.required && (
            <Text c="red" size="xs">
              {typeof props.error.required === "string"
                ? props.error.required
                : t("common.errors.required")}
            </Text>
          )}

          {props.error.min && props.min && (
            <Text c="red" size="xs">
              {typeof props.error.min === "string"
                ? props.error.min
                : t("common.errors.min", { min: props.min })}
            </Text>
          )}
          {props.error.max && props.max && (
            <Text c="red" size="xs">
              {typeof props.error.max === "string"
                ? props.error.max
                : t("common.errors.max", { max: props.max })}
            </Text>
          )}
        </>
      )}
    </Stack>
  );
}
