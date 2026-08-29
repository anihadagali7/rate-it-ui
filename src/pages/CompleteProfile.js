import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AuthClient from "../client/AuthClient";
import Button from "../shared/buttons/Button";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import UserContext from "../shared/context/userContext";
import AuthLayout from "../shared/layout/AuthLayout";
import SurfaceCard from "../shared/primitives/SurfaceCard";
import { tokens } from "../styles/tokens";

const initialErrorState = {
  userName: { value: false, message: "" },
  password: { value: false, message: "" },
};

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [payload, setPayload] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    userName: "",
    password: "",
  });
  const [errorValue, setErrorValue] = useState(initialErrorState);

  const completeProfile = useMutation({
    mutationFn: (profile) => AuthClient.completeProfile(profile),
    onSuccess: ({ data }) => {
      const user = data.data.user;
      localStorage.setItem("userName", user.userName);
      setCurrentUser(user);
      navigate("/");
    },
    onError: (error) => {
      const errors = error.response.data.errors;
      errorHandler("userName", true, errors.msg);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const errorHandler = (id, value, message) => {
    setErrorValue((prev) => ({
      ...prev,
      [id]: { value, message },
    }));
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp(
      "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
    );
    return validPassword.test(password);
  };

  const validateInput = () => {
    const userNameValidity = payload.userName.length > 3;
    const passwordValidity = payload.password
      ? isValidPassword(payload.password)
      : true;

    errorHandler(
      "userName",
      !userNameValidity,
      userNameValidity ? "" : "Value must be at least 4 characters."
    );
    errorHandler(
      "password",
      !passwordValidity,
      passwordValidity
        ? ""
        : "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit."
    );

    return userNameValidity && passwordValidity;
  };

  const checkToDisable = () => {
    return payload.userName.length === 0 || completeProfile.isLoading;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorValue(initialErrorState);

    if (!validateInput()) {
      return;
    }

    completeProfile.mutate({
      userName: payload.userName,
      firstName: payload.firstName,
      lastName: payload.lastName,
      ...(payload.password && { password: payload.password }),
    });
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
          Finish setting up
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 3 }}
        >
          Pick a username so people can find you on Rate It.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12 }}>
            <Grid item xs={6}>
              <PrimaryInputField
                label="First Name"
                value={payload.firstName}
                name="firstName"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <PrimaryInputField
                label="Last Name"
                value={payload.lastName}
                name="lastName"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <PrimaryInputField
                label="Username"
                value={payload.userName}
                name="userName"
                required
                onChange={handleChange}
                error={errorValue.userName.value}
                helperText={errorValue.userName.message || " "}
              />
            </Grid>
            <Grid item xs={12}>
              <PrimaryInputField
                label="Password (optional)"
                value={payload.password}
                name="password"
                type="password"
                onChange={handleChange}
                error={errorValue.password.value}
                helperText={
                  errorValue.password.message ||
                  "Add a password so you can also sign in without Google, Facebook, or Apple."
                }
              />
            </Grid>
            <Grid item xs={12} container justifyContent="end" sx={{ mt: 1 }}>
              <Button
                onClick={handleSubmit}
                disabled={checkToDisable()}
                variant="primary"
              >
                Finish
              </Button>
            </Grid>
          </Grid>
        </Box>
      </SurfaceCard>
    </AuthLayout>
  );
};

export default CompleteProfile;
