import { createTheme } from "@mui/material";

const fordF1Regular = {
  fontFamily: "FordF1Regular",
  fontDisplay: "swap",
  fontWeight: 400,
  // src: `url(${FordF1Regular}) format('woff2')`,
};

const fordF1Bold = {
  fontFamily: "FordF1Bold",
  fontDisplay: "swap",
  fontWeight: 700,
  // src: `url(${FordF1Bold}) format('woff2')`,
};
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
    h1: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 36,
      lineHeight: "44px",
      letterSpacing: "normal",
      fontWeight: 400,
    },
    h2: {
      fontFamily: "FordF1Bold, Arial, sans-serif",
      fontSize: 36,
      lineHeight: "44px",
      letterSpacing: "normal",
    },
    h3: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 28,
      lineHeight: "36px",
      letterSpacing: "normal",
      fontWeight: 400,
    },
    h4: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 24,
      lineHeight: "32px",
      letterSpacing: "normal",
    },
    h5: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 20,
      lineHeight: "28px",
      letterSpacing: "normal",
    },
    h6: {
      fontFamily: "FordF1Bold, Arial, sans-serif",
      fontSize: 16,
      lineHeight: "24px",
      letterSpacing: "normal",
    },
    body1: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 16,
      lineHeight: "24px",
      letterSpacing: "normal",
    },
    body2: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 14,
      lineHeight: "24px",
      letterSpacing: "normal",
    },
    subtitle1: {
      fontFamily: "FordF1Bold, Arial, sans-serif",
      fontSize: 16,
      lineHeight: "24px",
      letterSpacing: "normal",
    },
    subtitle2: {
      fontFamily: "FordF1Bold, Arial, sans-serif",
      fontSize: 14,
      lineHeight: "24px",
      letterSpacing: "normal",
    },
    caption: {
      fontFamily: "FordF1Regular, Arial, sans-serif",
      fontSize: 12,
      lineHeight: "16px",
      letterSpacing: "normal",
      color: "#666666",
    },
    button: {
      fontFamily: "FordF1Bold, Arial, sans-serif",
      lineHeight: "20px",
      textTransform: "none",
      letterSpacing: "normal",
    },
  },
  spacing: 4,
  palette: {
    primary: {
      main: "#0562D2",
      dark: "#044EA7",
    },
    info: {
      main: "#E4F1FF",
      dark: "#00142E",
    },
    success: {
      main: "#E5F3E6",
      dark: "#0D6E0D",
    },
    warning: {
      main: "#F9E8EA",
    },
    text: {
      primary: "#000000",
      secondary: "#333333",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          "@font-face": [fordF1Regular, fordF1Bold],
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: 0,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0px 16px",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderTop: "1px solid #6B7786",
        },
        summaryRoot: {
          padding: "24px 16px",
          "&.Mui-expanded": {
            minHeight: "unset",
          },
        },
        content: {
          display: "block",
          margin: 0,
          color: "#1F3047",
          transition: "color 0.1s ease-in-out",
          "&.Mui-expanded": {
            margin: 0,
            color: "#066FEF",
          },
        },
        expandIcon: {
          "&.Mui-expanded": {
            transform: "unset",
          },
        },
        detailsRoot: {
          display: "block",
          padding: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {},
      },
    },
    MuiAlert: {
      styleOverrides: {
        action: {
          padding: 0,
          margin: 0,
        },
        icon: {
          paddingTop: 4,
          paddingBottom: 0,
          opacity: 1,
          fontSize: 24,
          marginRight: 16,
        },
        message: {
          padding: 0,
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
          padding: "10px 24px",
          "&.Mui-disabled": {
            background: "rgb(217, 217, 217)",
            color: "rgb(155, 155, 155)",
          },
        },
        text: {
          padding: "10px 0px",
          "&:hover": {
            background: "none",
          },
          "&.Mui-disabled": {
            background: "none",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "FordF1Regular, Arial, sans-serif",
          letterSpacing: "normal",
          fontSize: 16,
          lineHeight: "24px",
          color: "#333333",
          borderRadius: 4,
        },
        label: {
          paddingLeft: 8,
          paddingRight: 8,
        },
        colorPrimary: {
          backgroundColor: "#E6F1FD",
          border: "1px solid #066FEF",
          color: "#000000",
        },
        colorSecondary: {
          backgroundColor: "#E5E5E5",
          border: "1px solid #808080",
          color: "#000000",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          width: 24,
          height: 24,
          outline: "1px solid #808080",
          boxSizing: "border-box",
          "input:disabled ~ &": {
            backgroundColor: "#E5E5E5",
            border: "1px solid #808080",
          },
          "&.Mui-checked": {
            outline: "1px solid #066FEF",
            backgroundColor: "#066FEF",
            fontSize: "0px",
            "& svg": {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
        },
        dialogContent: {
          padding: "0px 16px 24px 16px",
        },
        actions: {
          padding: "16px",

          "&.MuiDialogActions-spacing > :last-child": {
            marginLeft: 16,
          },
        },
        edgeEnd: {
          padding: 0,

          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "FordF1Regular, Arial, sans-serif",
          fontSize: 16,
          fontWeight: "400",
          lineHeight: "20px",
        },
        input: {
          marginTop: 0,
          "&::placeholder": {
            fontFamily: "FordF1Regular, Arial, sans-serif",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 8,
          outline: "1px solid #6B7786",
          color: "#00142E",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          lineHeight: "20px",
          marginBottom: 4,
        },
        formControl: {
          display: "inline",
          position: "relative",
          top: "unset",
          left: "unset",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          display: "inline",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiFormHelperText-root": {
            fontSize: 12,
            fontWeight: "400",
            lineHeight: "16px",
            color: "#BF152C",
            marginBottom: 0,
          },
          "& .MuiInputBase-root": {
            fontFamily: "FordF1Regular, Arial, sans-serif",
            borderRadius: 8,
            outline: "1px solid #6B7786",
            padding: "8px 16px",
            backgroundColor: "#FFFFFF",
            fontWeight: "400",
            lineHeight: "20px",
            color: "#00142E",
          },
          "& .Mui-error.MuiInputBase-root": {
            borderRadius: 8,
            outline: "1px solid #BF152C",
          },
          "& .MuiInputBase-input": {
            padding: 0,
          },
          "& .Mui-focused.MuiInputBase-root": {
            outline: "2px solid #066FEF",
          },
          "& .Mui-error.Mui-focused.MuiInputBase-root": {
            outline: "2px solid #BF152C",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #F5F6F7 0%, #FFFFFF 100%)",
          border: "none",
          borderRadius: 8,
          padding: "24px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "& > *": {
            borderBottom: "unset",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: "4px",
          transition: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "FordF1Regular, Arial, sans-serif",
          lineHeight: "28px",
          fontSize: "20px",
          color: "#333333",
          padding: "8px 0px",
          alignItems: "flex-start",
          borderBottom: "2px solid #000000",

          "&:last-of-type": {
            marginRight: 0,
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "0px",
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          lineHeight: "20px",
        },
        li: {
          margin: "0px 2px",
          fontSize: "14px",
          "&:not(:last-of-type) > a": {
            color: "#0562D2",
          },
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        root: {
          marginTop: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "20px",
          color: "#00142E",
        },
        outlined: {
          borderRadius: 8,
          border: "solid 1px #6B7786",
          backgroundColor: "white",
          boxSizing: "border-box",
          padding: "8px 16px",
          height: "auto",
          "&:focus": {
            borderRadius: 8,
            backgroundColor: "white",
            outline: "2px solid #066FEF",
          },
        },
        "&.Mui-disabled": {
          backgroundColor: "#E6E8EA",
        },
      },
    },
  },
});
