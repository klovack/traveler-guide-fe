import { FLUENCY } from "@/constants/languages";
import { Select } from "@mantine/core";
import { useTranslations } from "next-intl";

export type SelectFluencyProps = Omit<
  React.ComponentProps<typeof Select>,
  "data"
>;

export function SelectFluency(props: Readonly<SelectFluencyProps>) {
  const t = useTranslations();

  return (
    <Select
      label={t("common.languages.fluency.label")}
      data={FLUENCY.map((f) => ({
        value: f,
        label: t(`common.languages.fluency.options.${f}`),
      }))}
      {...props}
    />
  );
}
