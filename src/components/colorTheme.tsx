import { createContext, useCallback, useContext, useEffect, useState } from "react";
import dashify from "dashify";
import baseStyled, {
  ThemeProvider as StyledComponentsProvider,
  ThemedStyledInterface,
} from "styled-components";
import colors, { ColorMode, ThemeColors } from "./colors";

const INITIAL_COLOR_MODE = "--initial-color-mode";
const root = window.document.documentElement;
const initialColorMode = root.style.getPropertyValue(
  INITIAL_COLOR_MODE
) as ColorMode;
const mq = window.matchMedia("(prefers-color-scheme: dark)");

type ThemeType = {
  colorMode: ColorMode;
  setColorMode: (value: ColorMode) => void;
};

export const styled = baseStyled as ThemedStyledInterface<ThemeColors>;

export const ThemeContext = createContext<ThemeType>({
  colorMode: initialColorMode,
  setColorMode: () => {},
});

type Props = {
  children: JSX.Element;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

const updateCssVariables = (colors: ThemeColors) => {
  Object.keys(colors).forEach((key) => {
    root.style.setProperty(
      `--color-${dashify(key)}`,
      colors[key as keyof ThemeColors]
    );
  });
};

export const ThemeProvider = ({ children }: Props) => {
  const [colorMode, rawSetColorMode] = useState<ColorMode>(initialColorMode);

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    // If user has set their own preference then we don't react to this change.
    if (localStorage.getItem("color-mode") !== null) {
      return;
    }

    setColorMode(event.matches ? "dark" : "light");
  }, []);

  useEffect(() => {
    rawSetColorMode(initialColorMode);
    updateCssVariables(colors[initialColorMode]);

    mq.addEventListener("change", handleChange);
    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, [handleChange]);

  const setColorMode = (value: ColorMode) => {
    rawSetColorMode(value);
    updateCssVariables(colors[value]);

    // Persist it on update.
    window.localStorage.setItem("color-mode", value);
  };

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      <StyledComponentsProvider theme={colors[colorMode]}>
        {children}
      </StyledComponentsProvider>
    </ThemeContext.Provider>
  );
};
