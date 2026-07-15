import { createTheme } from "@mui/material";
import { tokens } from "./tokens";

const fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1440,
      xl: 1920,
    },
  },
  typography: {
    fontFamily,
    allVariants: {
      color: tokens.colors.textPrimary,
    },
    h1: {
      fontFamily,
      fontSize: 28,
      lineHeight: "36px",
      fontWeight: 700,
    },
    h2: {
      fontFamily,
      fontSize: 24,
      lineHeight: "32px",
      fontWeight: 700,
    },
    h3: {
      fontFamily,
      fontSize: 20,
      lineHeight: "28px",
      fontWeight: 600,
    },
    h4: {
      fontFamily,
      fontSize: 18,
      lineHeight: "26px",
      fontWeight: 600,
    },
    h5: {
      fontFamily,
      fontSize: 16,
      lineHeight: "24px",
      fontWeight: 600,
    },
    h6: {
      fontFamily,
      fontSize: 14,
      lineHeight: "20px",
      fontWeight: 600,
    },
    body1: {
      fontFamily,
      fontSize: 15,
      lineHeight: "24px",
      fontWeight: 400,
    },
    body2: {
      fontFamily,
      fontSize: 13,
      lineHeight: "20px",
      fontWeight: 400,
      color: tokens.colors.textSecondary,
    },
    subtitle1: {
      fontFamily,
      fontSize: 15,
      lineHeight: "22px",
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily,
      fontSize: 13,
      lineHeight: "18px",
      fontWeight: 600,
    },
    caption: {
      fontFamily,
      fontSize: 12,
      lineHeight: "16px",
      color: tokens.colors.textMuted,
    },
    button: {
      textTransform: "none",
      fontFamily,
      fontSize: 14,
      lineHeight: "20px",
      fontWeight: 600,
    },
    logo: {
      fontFamily,
      fontSize: "22px",
      fontWeight: 700,
      color: tokens.colors.accent,
      textDecoration: "none",
    },
  },
  spacing: 4,
  palette: {
    primary: {
      main: tokens.colors.accent,
      dark: tokens.colors.accentHover,
    },
    background: {
      default: tokens.colors.background,
      paper: tokens.colors.surface,
    },
    text: {
      primary: tokens.colors.textPrimary,
      secondary: tokens.colors.textSecondary,
    },
    success: {
      main: tokens.colors.success,
    },
    error: {
      main: tokens.colors.danger,
    },
    divider: tokens.colors.border,
  },
  shape: {
    borderRadius: tokens.radius.button,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.colors.background,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: tokens.radius.button,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.card,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.radius.card,
          border: `1px solid ${tokens.colors.border}`,
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily,
          borderRadius: tokens.radius.button,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: 15,
          fontWeight: 400,
          lineHeight: "20px",
          color: tokens.colors.textPrimary,
        },
        input: {
          "&::placeholder": {
            color: tokens.colors.textMuted,
            opacity: 1,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.button,
          border: `1.5px solid ${tokens.colors.textMuted}`,
          color: tokens.colors.textPrimary,
          padding: "10px 16px",
          transition: "border-color 0.15s ease",
          "&:before, &:after": {
            display: "none",
          },
          "&:hover": {
            borderColor: tokens.colors.textSecondary,
          },
          "&.Mui-focused": {
            borderColor: tokens.colors.accent,
            borderWidth: "1.5px",
          },
          "&.Mui-error": {
            borderColor: tokens.colors.danger,
          },
          "&.Mui-disabled": {
            backgroundColor: tokens.colors.surfaceHover,
            borderColor: tokens.colors.border,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: 14,
          lineHeight: "20px",
          marginBottom: 4,
          color: tokens.colors.textPrimary,
          fontWeight: 500,
        },
        formControl: {
          display: "inline",
          position: "relative",
          top: "unset",
          left: "unset",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiFormHelperText-root": {
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: tokens.colors.danger,
            marginLeft: 0,
          },
          "& .MuiInputBase-root": {
            fontFamily,
            borderRadius: tokens.radius.button,
            border: `1.5px solid ${tokens.colors.textMuted}`,
            padding: "10px 16px",
            backgroundColor: tokens.colors.surface,
            fontWeight: 400,
            lineHeight: "20px",
            color: tokens.colors.textPrimary,
            transition: "border-color 0.15s ease",
            "&:before, &:after": {
              display: "none",
            },
            "&:hover": {
              borderColor: tokens.colors.textSecondary,
            },
          },
          "& .MuiInputBase-input": {
            padding: 0,
          },
          "& .Mui-focused.MuiInputBase-root": {
            borderColor: tokens.colors.accent,
          },
          "& .Mui-error.MuiInputBase-root": {
            borderColor: tokens.colors.danger,
          },
          "& .Mui-error.Mui-focused.MuiInputBase-root": {
            borderColor: tokens.colors.danger,
          },
          "& .Mui-disabled.MuiInputBase-root": {
            backgroundColor: tokens.colors.surfaceHover,
            borderColor: tokens.colors.border,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
