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
    };
    
    createEffect(()=>console.log('theme()', theme()))

  return (
    <ThemeProviderCxt.Provider value={{ theme, changeTheme }}>
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
