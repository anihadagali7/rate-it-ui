import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthClient from "../../client/AuthClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import UserContext from "../../shared/context/userContext";
import { useMutation } from "@tanstack/react-query";

const initialErrorState = {
  currentPassword: { value: false, message: "" },
  newPassword: { value: false, message: "" },
  confirmNewPassword: { value: false, message: "" },
};

const ResetPassword = ({ currentProfile }) => {
  let navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [errorValue, setErrorValue] = useState(initialErrorState);
  const [payload, setPayload] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const resetPassword = useMutation({
    mutationFn: (passwordRequest) => {
      return AuthClient.resetPassword(passwordRequest);
    },
    onSuccess: () => {
      navigate(`/profile/${currentUser.userName}`);
    },
    onError: (error) => {
      // TODO handle 404 not found error
      let errors = error.response.data.errors;
      if (errors.msg.includes("Current password is not valid")) {
        errorHandler("currentPassword", true, errors.msg);
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp(
      "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
    );
    return validPassword.test(password);
  };

  const validatePasswordReset = async () => {
    const newPasswordValidity = isValidPassword(payload.newPassword);
    const confirmNewPasswordValidity =
      payload.newPassword === payload.confirmNewPassword;

    const currentValue = JSON.parse(JSON.stringify(errorValue));

    !newPasswordValidity
      ? (currentValue["newPassword"] = {
          value: true,
          message:
            "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit.",
        })
      : (currentValue["newPassword"] = { value: false, message: "" });

    !confirmNewPasswordValidity
      ? (currentValue["confirmNewPassword"] = {
          value: true,
          message: "Passwords should be equal",
        })
      : (currentValue["confirmNewPassword"] = { value: false, message: "" });

    await setErrorValue(currentValue);

    return newPasswordValidity && confirmNewPasswordValidity;
  };

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();
    const errorValueCopy = JSON.parse(JSON.stringify(initialErrorState));
    await setErrorValue(errorValueCopy);

    const passwordRequest = {
      userName: currentProfile.userName,
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    };

    if (await validatePasswordReset()) {
      resetPassword.mutate(passwordRequest);
    }
  };

  const errorHandler = async (id, value, message) => {
    const currentValue = JSON.parse(JSON.stringify(initialErrorState));
    currentValue[id] = { value: value, message: message };
    await setErrorValue(currentValue);
  };

  const checkToDisable = () => {
    const { currentPassword, newPassword, confirmNewPassword } = payload;

    const hasAllRequiredPasswords =
      currentPassword && newPassword && confirmNewPassword;

    return !hasAllRequiredPasswords || resetPassword.isLoading;
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2, xl: 2 }} columns={{ xs: 12 }}>
      <Grid item xs={12} sx={{ paddingBottom: "20px" }}>
        <Typography variant="h3">Reset password</Typography>
      </Grid>
      <Grid item xs={12}>
        <PrimaryInputField
          label="Current Password"
          value={payload.currentPassword}
          name="currentPassword"
          type="password"
          required
          onChange={(e) => handleChange(e)}
          error={errorValue["currentPassword"]["value"]}
          helperText={
            (errorValue["currentPassword"]["value"] && (
              <>
                <span>Current password is not valid</span>
              </>
            )) ||
            " "
          }
        />
      </Grid>
      <Grid item xs={12}>
        <PrimaryInputField
          label="New Password"
          value={payload.newPassword}
          name="newPassword"
          type="password"
          required
          onChange={(e) => handleChange(e)}
          error={errorValue["newPassword"]["value"]}
          helperText={
            (errorValue["newPassword"]["value"] && (
              <>
                <span>Password should contain at least</span>
                <ul>
                  <li>one upper case letter</li>
                  <li>one lower case letter</li>
                  <li>one special character</li>
                  <li>one digit</li>
                </ul>
              </>
            )) ||
            " "
          }
        />
      </Grid>
      <Grid item xs={12}>
        <PrimaryInputField
          label="New Password"
          value={payload.confirmNewPassword}
          name="confirmNewPassword"
          type="password"
          required
          onChange={(e) => handleChange(e)}
          error={errorValue["confirmNewPassword"]["value"]}
          helperText={
            (errorValue["confirmNewPassword"]["value"] && (
              <>
                <span>Passwords are not equal</span>
              </>
            )) ||
            " "
          }
        />
      </Grid>
      <Grid
        item
        xs={12}
        container
        justifyContent="end"
        sx={{ margin: "10px 0 30px 0" }}
      >
        <PrimaryButton
          onClick={resetPasswordSubmit}
          disabled={checkToDisable()}
          variant="contained"
        >
          Reset
        </PrimaryButton>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
