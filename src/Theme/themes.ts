import { createTheme } from "@suid/material";
import {
  bluePalette,
  darkPalette,
  greenPalette,
  lightPalette,
  redPalette,
} from "./palette";
import { Theme } from "@suid/material/styles";

export const lightTheme: Theme = createTheme({
  palette: lightPalette,
});
export const darkTheme: Theme = createTheme({ palette: darkPalette });
export const redTheme: Theme = createTheme({ palette: redPalette });
export const blueTheme: Theme = createTheme({ palette: bluePalette });
export const greenTheme: Theme = createTheme({ palette: greenPalette });
// Add blueTheme and greenTheme similarly...
