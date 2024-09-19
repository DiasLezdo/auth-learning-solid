import { FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import { Component, createSignal } from "solid-js";
import { useContextTheme } from "../../context/Theme";
import { SelectChangeEvent } from "@suid/material/Select";

type ThemeType = "light" | "dark" | "red" | "blue" | "green";

const ThemeSelector: Component<{}> = (props) => {
  const { changeTheme, theme, themePaletteName } = useContextTheme();

  const [themeName, setThemeName] = createSignal<ThemeType>(themePaletteName);

  const handleChange = (event: SelectChangeEvent) => {
    const themeValue = event.target.value as
      | "light"
      | "dark"
      | "red"
      | "blue"
      | "green";
    changeTheme(themeValue);
    setThemeName(themeValue);
    //   we should change later
    window.location.reload();
  };

  console.log("themePaletteName", themePaletteName);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Theme</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={themeName()}
          label="Theme"
          onChange={handleChange}
          size="small"
        >
          {["light", "dark", "red", "blue", "green"].map((e) => (
            <MenuItem
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
              }}
              value={e}
            >
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default ThemeSelector;
