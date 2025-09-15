import {
  Chip,
  Flex,
  Stack,
  Text,
  Button,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export type ChipItem = {
  id: string;
  name: string;
  checked: boolean;
};

export type ChipSelectorError = {
  min?: string | boolean;
  max?: string | boolean;
  required?: string | boolean;
};

export type ChipSelectorProps = {
  label: string;
  description?: string;
  error?: ChipSelectorError;
  required?: boolean;
  value?: string[] | null;
  onChange?: (value: string[]) => void;
  min?: number;
  max?: number;
  items: ChipItem[];
  onAddNew?: (name: string) => Promise<void> | void;
  addNewLabel?: string;
  addNewPlaceholder?: string;
  disabled?: boolean;
};

export function ChipSelector(props: Readonly<ChipSelectorProps>) {
  const t = useTranslations();
  const [isAddingMore, setIsAddingMore] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>("");

  const handleAddNew = async (name: string) => {
    if (!name.trim() || !props.onAddNew) return;

    await props.onAddNew(name.trim());
    setIsAddingMore(false);
    setNewItemName("");
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
        {props.items.map((item) => (
          <Chip
            id={item.id}
            checked={item.checked}
            key={item.id}
            value={item.id}
            disabled={props.disabled}
            onChange={(checked) => {
              if (checked && props.max && props.value?.length === props.max) {
                return;
              }
              props.onChange?.([
                ...(props.value || []).filter((v) => v !== item.id),
                ...(checked ? [item.id] : []),
              ]);
            }}
          >
            {item.name}
          </Chip>
        ))}

        {props.onAddNew && !isAddingMore && !props.disabled && (
          <Button
            variant="default"
            rightSection={<IconPlus size={14} />}
            radius="xl"
            size="xs"
            onClick={() => setIsAddingMore(true)}
          >
            {props.addNewLabel || "Add more"}
          </Button>
        )}

        {props.onAddNew && isAddingMore && (
          <TextInput
            variant="filled"
            size="xs"
            radius="xl"
            placeholder={props.addNewPlaceholder || "Item name"}
            onChange={(e) => setNewItemName(e.currentTarget.value)}
            value={newItemName}
            rightSection={
              <ActionIcon
                size="sm"
                onClick={() => {
                  setIsAddingMore(false);
                  setNewItemName("");
                }}
                variant="subtle"
                radius="xl"
              >
                <IconX size={14} />
              </ActionIcon>
            }
            onKeyDown={async (e) => {
              if (e.key === "Enter" && newItemName?.trim()) {
                e.preventDefault();
                await handleAddNew(newItemName.trim());
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
