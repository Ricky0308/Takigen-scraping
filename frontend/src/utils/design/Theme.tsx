import { createTheme, ThemeProvider, PaletteOptions, Palette } from '@mui/material/styles';

type extendedPalette = {
    lightGray : Palette
} & PaletteOptions

// const theme = createTheme({
//     palette: {
//       lightGray: {
//         main: "#ffa726"
//       },
//     },
//   });
