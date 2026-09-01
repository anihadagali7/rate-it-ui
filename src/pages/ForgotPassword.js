import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthClient from "../client/AuthClient";
import Button from "../shared/buttons/Button";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import AuthLayout from "../shared/layout/AuthLayout";
import SurfaceCard from "../shared/primitives/SurfaceCard";
import { tokens } from "../styles/tokens";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// The backend always returns this same message regardless of whether the
// email matches an account, to avoid revealing which emails are registered
// — the frontend must not derive a different message from anything else.
const GENERIC_SUCCESS_MESSAGE =
  "If an account with that email exists, we've sent a link to reset the password. It expires in 1 hour.";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const forgotPassword = useMutation({
    mutationFn: () => AuthClient.forgotPassword(email),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      setEmailError("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setEmailError("Value should be a valid email.");
      return;
    }
    setEmailError("");
    forgotPassword.mutate();
  };

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
          Forgot password?
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 3 }}
        >
          Enter your email and we'll send you a link to reset it.
        </Typography>

        {submitted ? (
          <Typography sx={{ fontSize: 14, color: tokens.colors.textPrimary }}>
            {GENERIC_SUCCESS_MESSAGE}
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <PrimaryInputField
                label="Email"
                value={email}
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError || " "}
              />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!email || forgotPassword.isLoading}
              >
                Send reset link
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button testId="backToLogin" buttonElement={Link} variant="ghost" link="/login">
            Back to sign in
          </Button>
        </Box>
      </SurfaceCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
