import { createTheme, MantineColorsTuple } from "@mantine/core";

export const BRAND_COLOR: MantineColorsTuple = [
  "#ffebe4",
  "#ffd7cc",
  "#ffad9a",
  "#ff8064",
  "#ff6b4a",
  "#ff4218",
  "#ff3507",
  "#e42600",
  "#cc1f00",
  "#b21300"
];

export const theme = createTheme({
  // region color
  colors: {
    brand: BRAND_COLOR,
  },
  primaryColor: "brand",
  // endregion color

  // region typography
  fontFamily: 'Nunito, sans-serif',
  headings: { fontFamily: 'Nunito, sans-serif' },
  // endregion typography

  // region radius
  defaultRadius: "lg",
  // endregion radius
});

export const COLOR = {
  BRAND: "brand",
}
