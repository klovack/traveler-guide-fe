import { Badge } from "@mantine/core";

type LanguageTagProps = {
  language: string;
  fluency?: string;
};

export function LanguageTag({ language, fluency }: Readonly<LanguageTagProps>) {
  return (
    <Badge variant="light" color="blue">
      {language} {fluency && `(${fluency})`}
    </Badge>
  );
}
