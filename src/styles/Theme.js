import { createTheme } from "@mui/material";
import { tokens } from "./tokens";

const fontFamily = tokens.fonts.body;
const displayFamily = tokens.fonts.display;

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily,
    allVariants: {
      color: tokens.colors.textPrimary,
    },
    h1: {
      fontFamily: displayFamily,
      fontSize: 34,
      lineHeight: "40px",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: displayFamily,
      fontSize: 28,
      lineHeight: "34px",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: displayFamily,
      fontSize: 22,
      lineHeight: "28px",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: displayFamily,
      fontSize: 18,
      lineHeight: "24px",
      fontWeight: 650,
    },
    h5: {
      fontFamily: displayFamily,
      fontSize: 16,
      lineHeight: "22px",
      fontWeight: 650,
    },
    h6: {
      fontFamily: fontFamily,
      fontSize: 14,
      lineHeight: "20px",
      fontWeight: 600,
    },
    body1: {
      fontFamily,
      fontSize: 16,
      lineHeight: "26px",
      fontWeight: 400,
    },
    body2: {
      fontFamily,
      fontSize: 14,
      lineHeight: "22px",
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
  },
  spacing: 4,
  palette: {
    primary: {
      main: tokens.colors.accent,
      dark: tokens.colors.accentHover,
      light: "#2A9A94",
    },
    secondary: {
      main: tokens.colors.signal,
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
          background: tokens.gradients.canvas,
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          fontFamily,
        },
        "::selection": {
          backgroundColor: tokens.colors.accentSubtle,
          color: tokens.colors.textPrimary,
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
          fontFamily,
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
          boxShadow: tokens.shadows.lift,
          backgroundColor: tokens.colors.surface,
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
          border: `1.5px solid ${tokens.colors.borderStrong}`,
          color: tokens.colors.textPrimary,
          padding: "10px 14px",
          transition: `border-color ${tokens.motion.quick}`,
          "&:before, &:after": {
            display: "none",
          },
          "&:hover": {
            borderColor: tokens.colors.accent,
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
          fontWeight: 600,
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
            border: `1.5px solid ${tokens.colors.borderStrong}`,
            padding: "10px 14px",
            backgroundColor: tokens.colors.surface,
            fontWeight: 400,
            lineHeight: "20px",
            color: tokens.colors.textPrimary,
            transition: `border-color ${tokens.motion.quick}`,
            "&:before, &:after": {
              display: "none",
            },
            "&:hover": {
              borderColor: tokens.colors.accent,
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
          fontWeight: 600,
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
