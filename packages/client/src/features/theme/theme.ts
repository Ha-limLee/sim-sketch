import { createTheme } from "@mui/material/styles";
import { grey, red, green, blue } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      grey: string;
      red: string;
      green: string;
      blue: string;
    };
  }
  interface ThemeOptions {
    status?: {
      grey?: string;
      red?: string;
      green?: string;
      blue?: string;
    };
  }
}

export const customTheme = createTheme({
  status: {
    grey: grey[500],
    red: red[500],
    green: green[500],
    blue: blue[500],
  },
});
