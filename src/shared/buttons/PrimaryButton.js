import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button, {
  name: "PrimaryButton",
  slot: "root",
})(({ theme }) => ({
  borderRadius: 24,
  fontSize: theme.typography.pxToRem(14),
  transition: "none",
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
    >
      {children}
    </StyledButton>
  );
});

export default PrimaryButton;
