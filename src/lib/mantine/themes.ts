import { createTheme, MantineColorsTuple, VariantColorResolverResult } from "@mantine/core";

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

export const ACCENT_COLOR: MantineColorsTuple = [
  "#f9f8f5",
  "#ebeae7",
  "#d7d4c9",
  "#c2bba8",
  "#b1a78c",
  "#a69a79",
  "#a1946e",
  "#8c805d",
  "#7d7151",
  "#6c6241"
]

export const theme = createTheme({
  // region color
  colors: {
    brand: BRAND_COLOR,
    accent: ACCENT_COLOR,
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
  ACCENT: "accent",
  BACKGROUND: "#FAFAFA",
  BACKGROUND_ALT: ACCENT_COLOR[0],
}
