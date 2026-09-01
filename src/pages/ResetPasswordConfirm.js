import React, { useContext, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthClient from "../client/AuthClient";
import Button from "../shared/buttons/Button";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import AuthLayout from "../shared/layout/AuthLayout";
import SurfaceCard from "../shared/primitives/SurfaceCard";
import UserContext from "../shared/context/userContext";
import { isValidPassword } from "../shared/validation/passwordValidation";
import { tokens } from "../styles/tokens";

const initialErrorState = {
  newPassword: { value: false, message: "" },
  confirmNewPassword: { value: false, message: "" },
};

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [payload, setPayload] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errorValue, setErrorValue] = useState(initialErrorState);
  const [submitError, setSubmitError] = useState("");

  const resetPassword = useMutation({
    mutationFn: () =>
      AuthClient.resetPasswordWithToken(token, payload.newPassword),
    onSuccess: ({ data }) => {
      localStorage.setItem("accessToken", data.accessToken);
      if (data.data.user.userName) {
        localStorage.setItem("userName", data.data.user.userName);
      }
      setCurrentUser(data.data.user);
      navigate("/");
    },
    onError: (error) => {
      setSubmitError(
        error?.response?.data?.errors?.msg ||
          "Something went wrong. Please try again."
      );
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = () => {
    const newPasswordValidity = isValidPassword(payload.newPassword);
    const confirmValidity = payload.newPassword === payload.confirmNewPassword;

    setErrorValue({
      newPassword: newPasswordValidity
        ? { value: false, message: "" }
        : {
            value: true,
            message:
              "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit.",
          },
      confirmNewPassword: confirmValidity
        ? { value: false, message: "" }
        : { value: true, message: "Passwords should be equal" },
    });

    return newPasswordValidity && confirmValidity;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    if (validate()) {
      resetPassword.mutate();
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <SurfaceCard padding={3}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: tokens.colors.textPrimary,
              mb: 1,
            }}
          >
            Invalid link
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 3 }}
          >
            This password reset link is missing its token. Request a new one
            below.
          </Typography>
          <Button
            testId="requestNewLink"
            buttonElement={Link}
            variant="primary"
            link="/forgot-password"
          >
            Request a new link
          </Button>
        </SurfaceCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <SurfaceCard padding={3}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: tokens.colors.textPrimary,
            mb: 0.5,
          }}
        >
          Choose a new password
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 3 }}
        >
          Enter and confirm your new password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <PrimaryInputField
              label="New Password"
              value={payload.newPassword}
              name="newPassword"
              type="password"
              required
              onChange={handleChange}
              error={errorValue.newPassword.value}
              helperText={errorValue.newPassword.message || " "}
            />
            <PrimaryInputField
              label="Confirm New Password"
              value={payload.confirmNewPassword}
              name="confirmNewPassword"
              type="password"
              required
              onChange={handleChange}
              error={errorValue.confirmNewPassword.value}
              helperText={errorValue.confirmNewPassword.message || " "}
            />
          </Stack>

          {submitError ? (
            <Typography
              sx={{ fontSize: 13, color: tokens.colors.danger, mt: 2 }}
            >
              {submitError}
            </Typography>
          ) : null}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                !payload.newPassword ||
                !payload.confirmNewPassword ||
                resetPassword.isLoading
              }
            >
              Reset password
            </Button>
          </Box>
        </Box>
      </SurfaceCard>
    </AuthLayout>
  );
};

export default ResetPasswordConfirm;
