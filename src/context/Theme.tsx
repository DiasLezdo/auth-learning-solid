import {
  createSignal,
  createContext,
  useContext,
  ParentComponent,
  createEffect,
} from "solid-js";
import {
  blueTheme,
  darkTheme,
  greenTheme,
  lightTheme,
  redTheme,
} from "../Theme/themes";
import { Theme, ThemeProvider } from "@suid/material";

interface ThemeContextType {
  theme: () => Theme; // Signal to get the current theme
  changeTheme: (newTheme: "light" | "dark" | "red" | "blue" | "green") => void; // Function to change theme
  themePaletteName: "light" | "dark" | "red" | "blue" | "green";
}

const ThemeProviderCxt = createContext<ThemeContextType>();

export const ThemeProviderContext: ParentComponent = (props) => {
  const themeName = () => {
    const thm = localStorage.getItem("theme");
    switch (thm) {
      case "light":
        return lightTheme;
        break;
      case "dark":
        return darkTheme;
        break;
      case "red":
        return redTheme;
        break;
      case "blue":
        return blueTheme;
        break;
      case "green":
        return greenTheme;
        break;
      default:
        return lightTheme;
    }
  };

  const [theme, setTheme] = createSignal<Theme>(themeName());
  type ThemeType = "light" | "dark" | "red" | "blue" | "green";

  const getInitialTheme = (): ThemeType => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "red" ||
      savedTheme === "blue" ||
      savedTheme === "green"
      ? (savedTheme as ThemeType)
      : "light";
  };

  const [themePaletteName, setThemePaletteName] = createSignal<ThemeType>(
    getInitialTheme()
  );

  const changeTheme = (newTheme: ThemeType) => {
    switch (newTheme) {
      case "light":
        setTheme(lightTheme);
        break;
      case "dark":
        setTheme(darkTheme);
        break;
      case "red":
        setTheme(redTheme);
        break;
      case "blue":
        setTheme(blueTheme);
        break;
      case "green":
        setTheme(greenTheme);
        break;
      default:
        setTheme(lightTheme);
    }
    localStorage.setItem("theme", newTheme ?? "light");
    setThemePaletteName(newTheme ?? "light");
  };

  return (
    <ThemeProviderCxt.Provider
      value={{ theme, changeTheme, themePaletteName: themePaletteName() }}
    >
      <ThemeProvider theme={theme()}>{props.children}</ThemeProvider>
    </ThemeProviderCxt.Provider>
  );
};

// Hook to use the Theme context
export const useContextTheme = () => {
  const context = useContext(ThemeProviderCxt);
  if (!context)
    throw new Error("useTheme must be used within a ThemeProviderContext");
  return context;
};
