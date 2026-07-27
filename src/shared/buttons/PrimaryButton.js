import Button from "./Button";

const variantMap = {
  contained: "primary",
  text: "ghost",
  outlined: "secondary",
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  danger: "danger",
};

const PrimaryButton = (props) => {
  const { variant = "primary", ...rest } = props;
  const mappedVariant = variantMap[variant] || variant;

  return <Button variant={mappedVariant} {...rest} />;
};

export default PrimaryButton;
