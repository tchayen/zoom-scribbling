export type ColorMode = "light" | "dark";

// NOTE:
// Every time anything here is changed, it should be synced to index.html.

const palette = {
  blue: "#0366d6",
  blueDimmedIntense: "rgba(3, 102, 214, 0.35)",
  blueDimmed: "rgba(3, 102, 214, 0.2)",
  white: "#ffffff",
  black: "#000000",
  lightGray: "#f6f8fa",
  gray: "#dfe2e5",
  darkGray: "#777777",
  darkestGray: "#24292e",
};

type Color = string;

export type ThemeColors = {
  primary: Color;
  primaryDimmed: Color;
  background: Color;
  grayBackground: Color;
  mainText: Color;
  border: Color;
  secondaryText: Color;
  secondaryButtonBackground: Color;
};

const light: ThemeColors = {
  primary: palette.blue,
  primaryDimmed: palette.blueDimmed,
  background: palette.white,
  grayBackground: palette.lightGray,
  mainText: palette.black,
  border: palette.gray,
  secondaryText: palette.darkGray,
  secondaryButtonBackground: palette.gray,
};

const dark: ThemeColors = {
  primary: palette.blue,
  primaryDimmed: palette.blueDimmedIntense,
  background: palette.black,
  grayBackground: palette.darkestGray,
  mainText: palette.white,
  border: palette.darkestGray,
  secondaryText: palette.darkGray,
  secondaryButtonBackground: palette.darkGray,
};

const colors = {
  light,
  dark,
};

export default colors;
