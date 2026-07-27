import React from "react";
import { InputLabel, TextField } from "@mui/material";
import { tokens } from "../../styles/tokens";

const PrimaryInputField = React.forwardRef((props, ref) => {
  const {
    type,
    placeholder,
    validationState,
    value,
    testId,
    disabled,
    readOnly,
    error,
    onChange,
    onClick,
    name,
    multiline,
    helperText,
    startAdornment,
    label,
    required,
    onKeyDown,
  } = props;

  return (
    <>
      {label ? (
        <InputLabel
          disableAnimation
          shrink={false}
          required={required}
          sx={{
            mb: 1,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: tokens.fonts.body,
            color: tokens.colors.textPrimary,
          }}
        >
          {label}
        </InputLabel>
      ) : null}
      <TextField
        InputProps={{
          readOnly,
          disableUnderline: true,
          startAdornment,
        }}
        inputProps={{
          "data-testid": testId,
        }}
        type={type}
        value={value}
        error={validationState === "ERROR" || error}
        color={
          validationState === "SUCCESS" ? "secondary" : "primary"
        }
        placeholder={placeholder}
        fullWidth
        disabled={disabled}
        onChange={onChange}
        onClick={onClick}
        ref={ref}
        name={name}
        multiline={multiline}
        helperText={helperText}
        variant="standard"
        onKeyDown={onKeyDown}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: tokens.colors.surface,
            border: `1.5px solid ${tokens.colors.borderStrong}`,
            borderRadius: `${tokens.radius.button}px`,
            padding: "11px 14px",
            color: tokens.colors.textPrimary,
            fontFamily: tokens.fonts.body,
            transition: `border-color ${tokens.motion.quick}`,
            "&:before, &:after": {
              display: "none",
            },
            "&:hover": {
              borderColor: tokens.colors.accent,
            },
            "&.Mui-focused": {
              borderColor: tokens.colors.accent,
              backgroundColor: tokens.colors.surface,
            },
            "&.Mui-error": {
              borderColor: tokens.colors.danger,
            },
            "&.Mui-disabled": {
              backgroundColor: tokens.colors.surfaceHover,
              borderColor: tokens.colors.border,
            },
          },
          "& .MuiInputBase-input": {
            padding: 0,
            color: tokens.colors.textPrimary,
            "&::placeholder": {
              color: tokens.colors.textMuted,
              opacity: 1,
            },
          },
          "& .MuiFormHelperText-root": {
            marginLeft: 0,
          },
        }}
      />
    </>
  );
});

export default PrimaryInputField;
