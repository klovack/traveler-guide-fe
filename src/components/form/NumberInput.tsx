import {
  NumberInputProps,
  NumberInputHandlers,
  NumberInput,
  ActionIcon,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useRef } from "react";

export type MihapeNumberInputProps = Omit<
  NumberInputProps,
  "rightSection" | "leftSection" | "hideControls"
>;

export function MihapeNumberInput(props: Readonly<MihapeNumberInputProps>) {
  const handlersRef = useRef<NumberInputHandlers>(undefined);

  return (
    <NumberInput
      leftSection={
        <ActionIcon
          size={props.size}
          variant="subtle"
          onClick={() => handlersRef.current?.decrement()}
        >
          <IconMinus />
        </ActionIcon>
      }
      rightSection={
        <ActionIcon
          size={props.size}
          variant="subtle"
          onClick={() => handlersRef.current?.increment()}
        >
          <IconPlus />
        </ActionIcon>
      }
      rightSectionWidth={32}
      hideControls
      handlersRef={handlersRef}
      styles={{
        input: {
          textAlign: "center",
        },
      }}
      {...props}
    />
  );
}
