import React, { useEffect, useState } from "react";
import { Provider } from "jotai";
import {
  CircularProgress,
  Container,
  InputLabel,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { theme } from "../Theme/Theme";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import AuthClient from "../client/AuthClient";
import { currentUser, currentlyLoggedIn } from "../state/user";
import { useAtom } from "jotai";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    margin: "20px 35px"
  },
  loginBtn: {
    backgroundColor: "#f4afc2",
    "&:hover": {
      backgroundColor: "#f4afc2"
    }
  },
  login: {
    fontWeight: "900",
    fontSize: "15px"
  }
});

const Login = () => {
  let navigate = useNavigate();
  const classes = useStyles();
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });
  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [loading, setLoading] = useState(false);
  const [errorValue, setErrorValue] = useState({
    email: { value: false, message: "" },
    password: { value: false, message: "" }
  });

  const onChangeEmail = (event) => {
    setLogin((credentials) => ({ ...login, email: event.target.value }));
  };

  const onChangePassword = (event) => {
    setLogin((credentials) => ({ ...login, password: event.target.value }));
  };

  const errorHandler = async (id, value, message) => {
    const currentValue = JSON.parse(JSON.stringify(errorValue));
    currentValue[id] = { value: value, message: message };
    setErrorValue(currentValue);
    value && setLoading(false);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateInput = () => {
    const emailValidity = isValidEmail(login.email);

    if (!emailValidity) {
      errorHandler("email", true, "Value should be a valid email.");
    }

    return emailValidity;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      setLoading(true);
      const result = await AuthClient.login(login.email, login.password, errorHandler);
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
                margin: "auto"
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  maxHeight: "480px",
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  borderRadius: "17px"
                }}
              >
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  <Box>
                    <Grid
                      container
                      component="form"
                      onSubmit={handleLogin}
                      spacing={{ xs: 2, md: 2, xl: 5 }}
                      columns={{ md: 12 }}
                    >
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "22px"
                          }}
                        >
                          Sign In
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            marginTop: "7px"
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
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            value={login.email}
                            onChange={onChangeEmail}
                            required
                            error={errorValue["email"]["value"]}
                            helperText={errorValue["email"]["value"] && errorValue["email"]["message"]}
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
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            type={"password"}
                            value={login.password}
                            onChange={onChangePassword}
                            required
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item xs={8} sx={{ marginTop: "8px" }}>
                        <Typography
                          sx={{
                            marginTop: "10px",
                            fontWeight: "bold",
                            fontSize: "14px"
                          }}
                          variant="blueText"
                        >
                          Forgot your password?
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="outlined"
                          className={classes.loginBtn}
                          type="submit"
                          sx={{
                            float: "right",
                            border: "transparent",
                            "&.MuiButtonBase-root:hover": {
                              border: "transparent"
                            },
                            borderRadius: "17px",
                            maxHeight: "35px",
                            "&.Mui-disabled": {
                              color: "#fff",
                              background: "#9E9E9E"
                            }
                          }}
                          disabled={loading}
                        >
                          {loading && (
                            <div style={{ color: "#ffffff" }}>
                              <CircularProgress size={20} color="inherit"
                                                sx={{ marginTop: "5px", marginRight: "7px" }} />
                            </div>
                          )}

                          <Typography
                            variant="normalText"
                            className={classes.login}
                          >
                            Sign In
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider
                    variant="middle"
                    sx={{
                      marginTop: "25px",
                      marginLeft: "0",
                      marginRight: "0"
                    }}
                  />
                  <Box
                    sx={{
                      margin: "auto",
                      marginTop: "20px",
                      marginBottom: "30px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Typography sx={{ fontWeight: 550 }}>
                        New to Rate It?
                      </Typography>
                      <Button component={Link} to="/signup">
                        <Typography variant="blueText" sx={{ fontWeight: 600 }}>
                          Join Now
                        </Typography>
                      </Button>
                    </div>
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

