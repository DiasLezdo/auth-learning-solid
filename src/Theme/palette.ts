import { Component } from "solid-js";
import { PaletteOptions } from "@suid/material/styles";

import grey from "@suid/material/colors/grey";

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#6200ea",
    light: "#9d46ff",
    dark: "#0a00b6",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#03dac6",
    light: "#66fff9",
    dark: "#00a896",
    contrastText: "#000000",
  },
  error: {
    main: "#b00020",
    light: "#ff5c8d",
    dark: "#790000",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffc947",
    dark: "#c66900",
    contrastText: "#000000",
  },
  info: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4caf50",
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#555555",
    disabled: "#9e9e9e",
  },
  background: {
    paper: "#ffffff",
    default: "#f4f6f8",
  },
  divider: "#e0e0e0",
  common: {
    black: "#000000",
    white: "#ffffff",
  },
  action: {
    active: "#6200ea",
    hover: "#3700b3",
    hoverOpacity: 0.08,
    selected: "#f3e5f5",
    selectedOpacity: 0.16,
    disabled: "#bdbdbd",
    disabledOpacity: 0.38,
    disabledBackground: "#f5f5f5",
    focus: "#ffcc00",
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
  grey: grey,
  contrastThreshold: 0,
  tonalOffset: 0,
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#bb86fc",
    light: "#e3d7ff",
    dark: "#8854c0",
    contrastText: "#000000",
  },
  secondary: {
    main: "#03dac6",
    light: "#66fff9",
    dark: "#00a896",
    contrastText: "#000000",
  },
  error: {
    main: "#cf6679",
    light: "#ffa4a2",
    dark: "#b00020",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffc947",
    dark: "#c66900",
    contrastText: "#000000",
  },
  info: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4caf50",
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#ffffff",
    secondary: "#cccccc",
    disabled: "#666666",
  },
  background: {
    paper: "#121212",
    default: "#181818",
  },
  divider: "#373737",
  common: {
    black: "#000000",
    white: "#ffffff",
  },
  action: {
    active: "#bb86fc",
    hover: "#8854c0",
    hoverOpacity: 0.08,
    selected: "#332240",
    selectedOpacity: 0.16,
    disabled: "#666666",
    disabledOpacity: 0.38,
    disabledBackground: "#333333",
    focus: "#03dac6",
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
  grey: grey,
  contrastThreshold: 0,
  tonalOffset: 0,
};

const redPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#ff1744",
    light: "#ff616f",
    dark: "#c4001d",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ff5252",
    light: "#ff867f",
    dark: "#c50e29",
    contrastText: "#ffffff",
  },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffc947",
    dark: "#c66900",
    contrastText: "#000000",
  },
  info: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4caf50",
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#4f0000",
    disabled: "#7e0000",
  },
  background: {
    paper: "#ffe6e6",
    default: "#ffcccc",
  },
  divider: "#ff9e9e",
  common: {
    black: "#000000",
    white: "#ffffff",
  },
  action: {
    active: "#ff1744",
    hover: "#ff616f",
    hoverOpacity: 0.08,
    selected: "#ffe6e6",
    selectedOpacity: 0.16,
    disabled: "#c4001d",
    disabledOpacity: 0.38,
    disabledBackground: "#ffcccc",
    focus: "#ff5252",
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
  grey: grey,
  contrastThreshold: 0,
  tonalOffset: 0,
};

const bluePalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#1976d2",
    light: "#63a4ff",
    dark: "#004ba0",
    contrastText: "#ffffff",
  },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffc947",
    dark: "#c66900",
    contrastText: "#000000",
  },
  info: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4caf50",
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#0d47a1",
    disabled: "#002171",
  },
  background: {
    paper: "#e3f2fd",
    default: "#bbdefb",
  },
  divider: "#82b1ff",
  common: {
    black: "#000000",
    white: "#ffffff",
  },
  action: {
    active: "#2196f3",
    hover: "#6ec6ff",
    hoverOpacity: 0.08,
    selected: "#bbdefb",
    selectedOpacity: 0.16,
    disabled: "#0069c0",
    disabledOpacity: 0.38,
    disabledBackground: "#bbdefb",
    focus: "#1976d2",
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
  grey: grey,
  contrastThreshold: 0,
  tonalOffset: 0,
};

const greenPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#4caf50",
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#388e3c",
    light: "#6abf69",
    dark: "#00600f",
    contrastText: "#ffffff",
  },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffc947",
    dark: "#c66900",
    contrastText: "#000000",
  },
  info: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4caf50",
    light: "#80e27e",
    dark: "#087f23",
    contrastText: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#1b5e20",
    disabled: "#004d40",
  },
  background: {
    paper: "#e8f5e9",
    default: "#c8e6c9",
  },
  divider: "#a5d6a7",
  common: {
    black: "#000000",
    white: "#ffffff",
  },
  action: {
    active: "#4caf50",
    hover: "#80e27e",
    hoverOpacity: 0.08,
    selected: "#c8e6c9",
    selectedOpacity: 0.16,
    disabled: "#087f23",
    disabledOpacity: 0.38,
    disabledBackground: "#c8e6c9",
    focus: "#388e3c",
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
  grey: grey,
  contrastThreshold: 0,
  tonalOffset: 0,
};

export { lightPalette, darkPalette, redPalette, bluePalette, greenPalette };
