import React, { useState } from "react";
import { Provider } from "jotai";
import {
  Container,
  InputLabel,
  StyledEngineProvider,
  TextField,
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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
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
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  <Box>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 2, xl: 5 }}
                      columns={{ md: 12 }}
                    >
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "22px",
                          }}
                        >
                          Sign In
                        </Typography>
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
                        <InputLabel>
                          <Typography>Email</Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px",
                              },
                            }}
                            size="small"
                            value={payload.email}
                            name="email"
                            onChange={handleChange}
                            required
                            error={errorValue["email"]["value"]}
                            helperText={
                              errorValue["email"]["value"] &&
                              errorValue["email"]["message"]
                            }
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography sx={{ marginTop: "10px" }}>
                            Password
                          </Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px",
                              },
                            }}
                            size="small"
                            type={"password"}
                            value={payload.password}
                            name="password"
                            onChange={handleChange}
                            required
                          />
                        </InputLabel>
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
                  </Box>
                  <Divider
                    variant="middle"
                    sx={{
                      marginTop: "25px",
                      marginLeft: "0",
                      marginRight: "0",
                    }}
                  />
                  <Box
                    sx={{
                      margin: "auto",
                      marginTop: "20px",
                      marginBottom: "30px",
                    }}
                  >
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
                </div>
              </Paper>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Login;
