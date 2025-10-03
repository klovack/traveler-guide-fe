import { Slider, SliderProps, Stack, Text, TextProps } from "@mantine/core";

export type SliderWithLabelProps = {
  label: string;
  required?: boolean;
  text?: TextProps;
  slider?: SliderProps;
};

export function SliderWithLabel(props: Readonly<SliderWithLabelProps>) {
  return (
    <Stack>
      <Text {...props.text} size="sm" fw={500}>
        {props.label}{" "}
        {props.required ? <span className="text-red-500">*</span> : ""}
      </Text>

      <Slider {...props.slider} />
    </Stack>
  );
}
