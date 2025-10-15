import {
  Button,
  Combobox,
  ComboboxDropdown,
  ComboboxTarget,
  Group,
  InputBase,
  Stack,
  StackProps,
  Text,
  useCombobox,
} from "@mantine/core";
import { MihapeNumberInput } from "@/components/form/NumberInput";
import { TripWizardGroupSize } from "tg-sdk";
import { useTranslations } from "next-intl";

export type SelectGroupSizeProps = Omit<StackProps, "onChange"> & {
  label: string;
  required?: boolean;
  description?: string;
  value?: TripWizardGroupSize;
  onChange?: (value: TripWizardGroupSize) => void;
};

export function SelectGroupSize(props: Readonly<SelectGroupSizeProps>) {
  const combobox = useCombobox();
  const t = useTranslations();

  // Destructure onChange from props so it isn't passed to Stack
  const { onChange, ...stackProps } = props;

  const numOfAdults = props.value?.adult ?? 0;
  const numOfChildren = props.value?.children ?? 0;
  const numOfInfants = props.value?.infants ?? 0;

  const handleGroupSizeChange = (groupSize: {
    adult?: number;
    children?: number;
    infants?: number;
  }) => {
    const { adult, children, infants } = groupSize;
    props.onChange?.({
      adult: adult ?? numOfAdults,
      children: children ?? numOfChildren,
      infants: infants ?? numOfInfants,
    });
  };

  return (
    <Stack {...stackProps} gap={0}>
      <Stack gap={0}>
        <Text fw="500" size="sm">
          {props.label}
          {props.required && <span style={{ color: "red" }}> *</span>}
        </Text>
        {props.description && (
          <Text c="dimmed" size="xs">
            {props.description}
          </Text>
        )}
      </Stack>
      <Combobox store={combobox} width={300}>
        <ComboboxTarget>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents="none"
            onClick={() => combobox.toggleDropdown()}
          >
            {numOfAdults} {t("common.groupSize.adults")}, {numOfChildren}{" "}
            {t("common.groupSize.children")}, {numOfInfants}{" "}
            {t("common.groupSize.infants")}
          </InputBase>
        </ComboboxTarget>

        <ComboboxDropdown>
          <Stack p="md" gap="sm">
            <Group grow>
              <Text>Adults</Text>
              <MihapeNumberInput
                defaultValue={0}
                min={1}
                max={10}
                value={props.value?.adult}
                onChange={(value) =>
                  handleGroupSizeChange({ adult: Number(value) })
                }
              />
            </Group>
            <Group grow>
              <Text>Children</Text>
              <MihapeNumberInput
                defaultValue={0}
                min={0}
                max={10}
                value={props.value?.children ?? undefined}
                onChange={(value) =>
                  handleGroupSizeChange({ children: Number(value) })
                }
              />
            </Group>
            <Group grow>
              <Text>Infant</Text>
              <MihapeNumberInput
                defaultValue={0}
                min={0}
                max={10}
                value={props.value?.infants ?? undefined}
                onChange={(value) =>
                  handleGroupSizeChange({ infants: Number(value) })
                }
              />
            </Group>

            <Button
              variant="outline"
              fullWidth
              onClick={() => combobox.closeDropdown()}
            >
              {t("common.buttons.confirm")}
            </Button>
          </Stack>
        </ComboboxDropdown>
      </Combobox>
    </Stack>
  );
}
