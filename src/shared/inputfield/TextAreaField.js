import React from "react";
import { InputLabel, Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import textAreaStyles from "./TextAreaField.module.scss";

const TextAreaField = ({
  placeholder,
  required,
  maxCharacters,
  disabled,
  label,
  hasCharacterCount,
  testId,
  onChange,
  minRows,
  value,
  name
}) => {
  const [text, setText] = React.useState(value || "");

  const handleChange = (event) => {
    setText(event.target.value);
    onChange(event);
  };

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
      <TextareaAutosize
        className={textAreaStyles.empTextArea}
        value={value}
        minRows={minRows}
        maxRows={4}
        name={name}
        placeholder={placeholder}
        required={required}
        maxLength={hasCharacterCount ? maxCharacters : null}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
        data-testid={testId}
      />
      {hasCharacterCount && (
        <Typography
          variant="body2"
          color={text.length === maxCharacters ? "error" : "inherit"}
        >{`${text.length}/${maxCharacters} characters`}</Typography>
      )}
    </>
  );
};

export default TextAreaField;
