import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

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
    marginLeft: "5px"
  }
});

const Signup = () => {
  let navigate = useNavigate();
  const classes = useStyles();
  const [newAccount, setNewAccount] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: ""
  });
  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [loading, setLoading] = useState(false);
  const [errorValue, setErrorValue] = useState({
    firstName: { value: false, message: "" },
    lastName: { value: false, message: "" },
    email: { value: false, message: "" },
    userName: { value: false, message: "" },
    phoneNumber: { value: false, message: "" },
    password: { value: false, message: "" }
  });

  const onChangeFirstName = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      firstName: event.target.value
    }));
  };

  const onChangeLastName = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      lastName: event.target.value
    }));
  };

  const onChangeUserName = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      userName: event.target.value
    }));
  };

  const onChangeEmail = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      email: event.target.value
    }));
  };

  const onChangePassword = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      password: event.target.value
    }));
  };

  const onChangePhoneNumber = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      phoneNumber: event.target.value
    }));
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6}$\n");
    return validPassword.test(password);
  };

  const errorHandler = async (id, value, message) => {
    console.log("-> error", id, value, message);
    const currentValue = JSON.parse(JSON.stringify(errorValue));
    currentValue[id] = { value: value, message: message };
    setErrorValue(currentValue);
    value && setLoading(false);
  };

  const validateInput = () => {
    const emailValidity = isValidEmail(newAccount.email);
    const passwordValidity = isValidPassword(newAccount.password);
    const phoneNumberValidity = newAccount.phoneNumber.length === 10;
    const firstNameValidity = newAccount.firstName.length > 0;
    const lastNameValidity = newAccount.lastName.length > 0;
    const userNameValidity = newAccount.userName.length > 0;

    !emailValidity && errorHandler("email", true, "Value should be a valid email.");
    !passwordValidity && errorHandler("password", true, "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit.");
    !phoneNumberValidity && errorHandler("phoneNumber", true, "Value should be 10 digits.");
    !firstNameValidity && errorHandler("firstName", true, "Required");
    !lastNameValidity && errorHandler("lastName", true, "Required");
    !userNameValidity && errorHandler("userName", true, "Required");

    return (
      emailValidity &&
      passwordValidity &&
      phoneNumberValidity &&
      firstNameValidity &&
      lastNameValidity &&
      userNameValidity
    );
  };

  const handleSignup = async () => {
    const newUser = {
      firstName: newAccount.firstName,
      lastName: newAccount.lastName,
      email: newAccount.email,
      userName: newAccount.userName,
      password: newAccount.password,
      phoneNumber: newAccount.phoneNumber
    };

    if (validateInput()) {
      setLoading(true);
      const result = await AuthClient.signup(newUser);
      setUserLoggedIn(true);
      setUser(result.data.user);
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
                height: "100%",
                margin: "auto"
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  height: isMobile ? "685px" : "100%",
                  borderRadius: "17px",
                  marginBottom: "20px"
                }}
              >
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  <Box>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 2, xl: 2 }}
                      columns={{ md: 12 }}
                    >
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "22px"
                          }}
                        >
                          Create an Account
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography>First Name</Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            required
                            value={newAccount.firstName}
                            onChange={onChangeFirstName}
                            error={errorValue["firstName"]["value"]}
                            helperText={errorValue["firstName"]["value"] && errorValue["firstName"]["message"]}
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item xs={6} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography>Last Name</Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            required
                            value={newAccount.lastName}
                            onChange={onChangeLastName}
                            error={errorValue["lastName"]["value"]}
                            helperText={errorValue["lastName"]["value"] && errorValue["lastName"]["message"]}
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography>Username</Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            required
                            value={newAccount.userName}
                            onChange={onChangeUserName}
                            error={errorValue["userName"]["value"]}
                            helperText={errorValue["userName"]["value"] && errorValue["userName"]["message"]}
                          />
                        </InputLabel>
                        <InputLabel sx={{ marginTop: "15px" }}>
                          <Typography>Phone Number</Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            required
                            value={newAccount.phoneNumber}
                            onChange={onChangePhoneNumber}
                            error={errorValue["phoneNumber"]["value"]}
                            helperText={errorValue["phoneNumber"]["value"] && errorValue["phoneNumber"]["message"]}
                          />
                        </InputLabel>
                        <InputLabel sx={{ marginTop: "15px" }}>
                          <Typography>Email</Typography>
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                borderRadius: "17px"
                              }
                            }}
                            size="small"
                            required
                            type={"email"}
                            value={newAccount.email}
                            onChange={onChangeEmail}
                            error={errorValue["email"]["value"]}
                            helperText={errorValue["email"]["value"] && errorValue["email"]["message"]}
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography sx={{ marginTop: "15px" }}>
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
                            required
                            value={newAccount.password}
                            onChange={onChangePassword}
                            error={errorValue["password"]["value"]}
                            helperText={errorValue["password"]["value"] && (
                              <>
                                <span>Password should contain at least</span>
                                <ul>
                                  <li>one upper case letter</li>
                                  <li>one lower case letter</li>
                                  <li>one special character</li>
                                  <li>one digit.</li>
                                </ul>
                              </>
                            )}
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item md={12} sx={{ width: "100%" }}>
                        <Button
                          variant="outlined"
                          className={classes.loginBtn}
                          onClick={handleSignup}
                          sx={{
                            float: "right",
                            marginLeft: "43px",
                            marginTop: "10px",
                            width: "100%",
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
                            Sign Up
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        sx={{
                          marginTop: "0px",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%"
                        }}
                      >
                        <Button
                          component={Link}
                          to="/login"
                          sx={{ marginTop: "10px" }}
                        >
                          <Typography
                            variant="blueText"
                            sx={{
                              fontWeight: 600,
                              marginLeft: "-8px",
                              fontSize: "15px"
                            }}
                          >
                            Sign in instead
                          </Typography>
                        </Button>
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

export default Signup;
