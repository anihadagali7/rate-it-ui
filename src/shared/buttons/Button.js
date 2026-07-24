import MuiButton from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React from "react";
import { tokens } from "../../styles/tokens";

const variantStyles = {
  primary: {
    backgroundColor: tokens.colors.accent,
    color: "#FBFCFB",
    border: `1px solid ${tokens.colors.accent}`,
    "&:hover": {
      backgroundColor: tokens.colors.accentHover,
      borderColor: tokens.colors.accentHover,
    },
  },
  secondary: {
    backgroundColor: "transparent",
    color: tokens.colors.textPrimary,
    border: `1.5px solid ${tokens.colors.borderStrong}`,
    "&:hover": {
      backgroundColor: tokens.colors.surfaceHover,
      borderColor: tokens.colors.accent,
    },
  },
  ghost: {
    backgroundColor: "transparent",
    color: tokens.colors.accent,
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: tokens.colors.accentSubtle,
    },
  },
  danger: {
    backgroundColor: tokens.colors.danger,
    color: "#FFFFFF",
    border: `1px solid ${tokens.colors.danger}`,
    "&:hover": {
      backgroundColor: "#B93A3A",
      borderColor: "#B93A3A",
    },
  },
};

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) =>
    !["buttonVariant", "customWidth", "customHeight"].includes(prop),
})(({ buttonVariant = "primary", customWidth, customHeight }) => ({
  borderRadius: `${tokens.radius.button}px`,
  textTransform: "none",
  fontFamily: tokens.fonts.body,
  fontWeight: 650,
  fontSize: 14,
  lineHeight: "20px",
  padding: "9px 18px",
  boxShadow: "none",
  width: customWidth,
  height: customHeight,
  transition: `background-color ${tokens.motion.quick}, border-color ${tokens.motion.quick}, color ${tokens.motion.quick}`,
  ...variantStyles[buttonVariant],
  "&.Mui-disabled": {
    backgroundColor: tokens.colors.surfaceHover,
    color: tokens.colors.textMuted,
    borderColor: tokens.colors.border,
  },
}));

const muiVariantMap = {
  primary: "contained",
  secondary: "outlined",
  ghost: "text",
  danger: "contained",
};

const Button = React.forwardRef((props, ref) => {
  const {
    testId,
    disabled,
    children,
    variant = "primary",
    rightIcon,
    leftIcon,
    onClick,
    submitButton,
    id,
    href,
    buttonElement,
    link,
    width,
    height,
    sx,
    ...rest
  } = props;

  let Component = "button";
  if (buttonElement) {
    Component = buttonElement;
  } else if (href) {
    Component = "a";
  }

  return (
    <StyledButton
      component={Component}
      disabled={disabled}
      buttonVariant={variant}
      variant={muiVariantMap[variant] || "contained"}
      startIcon={leftIcon || null}
      endIcon={rightIcon || null}
      onClick={onClick}
      type={submitButton ? "submit" : "button"}
      id={id}
      ref={ref}
      data-testid={testId}
      href={href}
      to={link}
      customWidth={width}
      customHeight={height}
      disableElevation
      disableRipple
      sx={sx}
      {...rest}
    >
      {children}
    </StyledButton>
  );
});

export default Button;
