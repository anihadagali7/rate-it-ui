import React, { useContext, useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import AuthClient from "../client/AuthClient";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../shared/buttons/Button";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import SocialAuthButtons from "../shared/social/SocialAuthButtons";
import UserContext from "../shared/context/userContext";
import AuthLayout from "../shared/layout/AuthLayout";
import SurfaceCard from "../shared/primitives/SurfaceCard";
import { tokens } from "../styles/tokens";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  let navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const { setCurrentUser } = useContext(UserContext);
  const [errorValue, setErrorValue] = useState({
    email: { value: false, message: "" },
    password: { value: false, message: "" },
  });

  const login = useMutation({
    mutationFn: () => {
      return AuthClient.login(payload.email, payload.password);
    },
    onSuccess: ({ data }) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userName", data.data.user.userName);
      setCurrentUser(data.data.user);
      navigate("/");
    },
    onError: (error) => {
      let errors = error.response.data.errors;
      errorHandler("email", true, errors.msg);
    },
  });

  const [socialError, setSocialError] = useState("");

  const handleSocialSuccess = (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (user.userName) {
      localStorage.setItem("userName", user.userName);
    }
    setCurrentUser(user);
    navigate(user.isProfileComplete ? "/" : "/complete-profile");
  };

  const handleSocialError = () => {
    setSocialError("Couldn't sign in. Please try again.");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      login.mutate();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const checkToDisable = () => {
    const { email, password } = payload;

    const hasAllRequiredFields = email && password;

    return login.isLoading || !hasAllRequiredFields;
  };

  const errorHandler = async (id, value, message) => {
    const currentValue = JSON.parse(JSON.stringify(errorValue));
    currentValue[id] = { value: value, message: message };
    setErrorValue(currentValue);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateInput = () => {
    const emailValidity = isValidEmail(payload.email);

    if (!emailValidity) {
      errorHandler("email", true, "Value should be a valid email.");
    }

    return emailValidity;
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
          Sign In
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: tokens.colors.textSecondary,
            mb: 3,
          }}
        >
          Stay updated on your media
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <Stack spacing={2}>
            <PrimaryInputField
              label="Email"
              value={payload.email}
              name="email"
              required
              onChange={(e) => handleChange(e)}
              error={errorValue["email"]["value"]}
              helperText={
                (errorValue["email"]["value"] &&
                  errorValue["email"]["message"]) ||
                " "
              }
            />
            <PrimaryInputField
              label="Password"
              value={payload.password}
              name="password"
              required
              type="password"
              onChange={(e) => handleChange(e)}
            />
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2.5,
            }}
          >
            <Button
              testId="forgotPassword"
              buttonElement={Link}
              variant="ghost"
              link="/forgot-password"
            >
              Forgot password
            </Button>
            <Button
              variant="primary"
              disabled={checkToDisable()}
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography
            sx={{
              fontSize: 12,
              color: tokens.colors.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Or continue with
          </Typography>
        </Divider>

        <SocialAuthButtons
          onSuccess={handleSocialSuccess}
          onError={handleSocialError}
        />
        {socialError ? (
          <Typography
            sx={{
              fontSize: 13,
              color: tokens.colors.danger,
              mt: 1,
              textAlign: "center",
            }}
          >
            {socialError}
          </Typography>
        ) : null}

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
            New to Rate It?
          </Typography>
          <Button
            testId="signUpLink"
            buttonElement={Link}
            variant="ghost"
            link="/signup"
          >
            Join Now
          </Button>
        </Stack>
      </SurfaceCard>
    </AuthLayout>
  );
};

export default Login;
