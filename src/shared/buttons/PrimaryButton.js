import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledButton = styled(Button, {
  name: "PrimaryButton",
  slot: "root",
})(({ theme, width, height }) => ({
  borderRadius: 24,
  fontSize: theme.typography.pxToRem(14),
  transition: "none",
  width: width,
  height: height,
}));

const PrimaryButton = React.forwardRef((props, ref) => {
  const {
    testId,
    disabled,
    children,
    variant,
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
      variant={variant}
      startIcon={leftIcon ? leftIcon : null}
      endIcon={rightIcon ? rightIcon : null}
      onClick={onClick}
      type={submitButton ? "submit" : "button"}
      id={id}
      ref={ref}
      data-testid={testId}
      href={href}
      to={link}
      width={width}
      height={height}
    >
      {children}
    </StyledButton>
  );
});

export default PrimaryButton;
