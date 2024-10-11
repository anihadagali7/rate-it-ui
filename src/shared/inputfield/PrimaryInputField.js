import React from "react";
import { InputLabel, TextField } from "@mui/material";

// available props
// type: string (text, email)
// placeholder: string
// validationState: string (error, success, default)
// value: string
// testId: string
// disabled: bool
// readOnly: bool
// error: bool
// onChange: function (to access or validate internal text value)
// onClick: function (to activate some form behavior like a radio toggle)

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
  } = props;

  return (
    <>
      <InputLabel
        disableAnimation
        shrink={false}
        required={required}
        sx={{ mb: 1 }}
      >
        {label}
      </InputLabel>
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
      ></TextField>
    </>
  );
});
export default PrimaryInputField;
