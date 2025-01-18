import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2E5CAC",
            light: "#4B7BDA",
            dark: "#1E3C72",
        },
        secondary: {
            main: "#19857b",
        },
        background: {
            default: "#FFFFFF",
            paper: "#F8F9FA",
        },
    },
});

export default theme;
