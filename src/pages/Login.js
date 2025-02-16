import React, { useContext, useState } from "react";
import { Container, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AuthClient from "../client/AuthClient";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import UserContext from "../shared/context/userContext";
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
    <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "17px",
        }}
      >
        <Box sx={{ padding: "10px 35px" }} mb={2}>
          <Grid
            container
            spacing={{ xs: 2, md: 2, xl: 5 }}
            columns={{ md: 12 }}
          >
            <Grid item xs={8}>
              <Typography variant="h3">Sign In</Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  marginTop: "7px",
                }}
              >
                Stay updated on your media
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
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
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <PrimaryInputField
                label="Password"
                value={payload.password}
                name="password"
                required
                type="password"
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid
              item
              xs={6}
              container
              alignContent="center"
              sx={{ marginTop: "15px" }}
            >
              <PrimaryButton
                testId="forgotPassword"
                buttonElement={Link}
                variant="text"
                link="/signup"
                disabled
              >
                Forgot password
              </PrimaryButton>
            </Grid>
            <Grid
              item
              xs={6}
              container
              justifyContent="flex-end"
              sx={{ marginTop: "15px" }}
            >
              <PrimaryButton
                variant="contained"
                disabled={checkToDisable()}
                onClick={handleLogin}
              >
                Sign In
              </PrimaryButton>
            </Grid>
          </Grid>
          <Divider
            variant="middle"
            sx={{
              marginTop: "25px",
            }}
          />
          <Grid container sx={{ paddingTop: "20px" }}>
            <Grid item xs={12} container justifyContent="center">
              <Stack direction="row" spacing={4}>
                <Typography sx={{ fontWeight: 550, alignContent: "center" }}>
                  New to Rate It?
                </Typography>
                <PrimaryButton
                  testId="signUpLink"
                  buttonElement={Link}
                  variant="text"
                  link="/signup"
                >
                  Join Now
                </PrimaryButton>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
