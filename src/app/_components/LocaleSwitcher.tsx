"use client";

import { Locale, localeToFlag } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";
import { Button, Combobox, Tooltip, useCombobox } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import Flag, { FlagProps } from "react-flagpack";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const combobox = useCombobox();
  const t = useTranslations("common.languages.options");

  const handleSelectLocale = async (locale: string) => {
    if (!localeToFlag[locale as Locale]) {
      combobox.closeDropdown();
      return;
    }

    startTransition(() => {
      setUserLocale(locale as Locale);
    });
    combobox.closeDropdown();
  };

  const localeOptions = Object.entries<FlagProps["code"]>(localeToFlag).map(
    ([key, value]) => (
      <Tooltip label={t(key)} key={key} position="left">
        <Combobox.Option value={key} ta={"center"}>
          <Flag
            code={value}
            hasDropShadow
            hasBorder
            gradient="real-linear"
            size="M"
          />
        </Combobox.Option>
      </Tooltip>
    )
  );

  return (
    <Combobox
      disabled={isPending}
      store={combobox}
      onOptionSubmit={handleSelectLocale}
      width={50}
    >
      <Combobox.Target>
        <Button variant="subtle" onClick={() => combobox.openDropdown()}>
          <Flag
            code={localeToFlag[locale as Locale]}
            size="M"
            hasDropShadow
            hasBorder
            gradient="real-linear"
          />
        </Button>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{localeOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
