"use client";

import { Locale, localeToFlag } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";
import { Button, Combobox, useCombobox } from "@mantine/core";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import Flag, { FlagProps } from "react-flagpack";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const combobox = useCombobox();

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
      <Combobox.Option key={key} value={key} ta={"center"}>
        <Flag code={value} />
      </Combobox.Option>
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
          <Flag code={localeToFlag[locale as Locale]} size="M" />
        </Button>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{localeOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
