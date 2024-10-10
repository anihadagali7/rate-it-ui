import React, { useState } from "react";
import { Provider } from "jotai";
import {
  Container,
  StyledEngineProvider,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "../Theme/Theme";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AuthClient from "../client/AuthClient";
import { currentUser, currentlyLoggedIn } from "../state/user";
import { useAtom } from "jotai";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";

const Login = () => {
  let navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [errorValue, setErrorValue] = useState({
    email: { value: false, message: "" },
    password: { value: false, message: "" },
  });

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

    return !hasAllRequiredFields;
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      const result = await AuthClient.login(
        payload.email,
        payload.password,
        errorHandler
      );
      setUserLoggedIn(true);
      setUser(result.user);
      navigate("/");
    }
  };

  return (
    <Provider>
      <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
        <Box
          sx={{
            width: "100%",
            height: 500,
            margin: "auto",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxHeight: "480px",
              backgroundColor: "#FFFFFF",
              margin: "auto",
              borderRadius: "17px",
            }}
          >
            <Box sx={{ padding: "10px 35px", minHeight: "385px" }} mb={2}>
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
                  <Box mb={2}>
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
                  </Box>
                  <Box mb={2}>
                    <PrimaryInputField
                      label="Password"
                      value={payload.password}
                      name="password"
                      required
                      type="password"
                      onChange={(e) => handleChange(e)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={8} container alignContent="center">
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
                <Grid item xs={4} container justifyContent="flex-end">
                  <div style={{}}>
                    <PrimaryButton
                      variant="contained"
                      disabled={checkToDisable()}
                      onClick={handleLogin}
                    >
                      Sign In
                    </PrimaryButton>
                  </div>
                </Grid>
              </Grid>
              <Divider
                variant="middle"
                sx={{
                  marginTop: "25px",
                }}
              />
              <Box mb={6} paddingTop={"20px"}>
                <Grid container>
                  <Grid item xs={12} container justifyContent="center">
                    <Typography sx={{ fontWeight: 550 }}>
                      New to Rate It?
                      <PrimaryButton
                        testId="signUpLink"
                        buttonElement={Link}
                        variant="text"
                        link="/signup"
                      >
                        Join Now
                      </PrimaryButton>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Provider>
  );
};

export default Login;
