import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { isMobile } from "react-device-detect";
import Grid from "@mui/material/Grid";
import {
  CircularProgress,
  Container,
  InputLabel,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { theme } from "../../Theme/Theme";
import { Provider, useAtom } from "jotai";
import { currentlyLoggedIn, currentUser } from "../../state/user";
import AuthClient from "../../client/AuthClient";
import { makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import ResetPassword from "./ResetPassword";

const useStyles = makeStyles({
  container: {
    margin: "20px 35px",
  },
  loginBtn: {
    backgroundColor: "#f4afc2",
    "&:hover": {
      backgroundColor: "#f4afc2",
    },
  },
  login: {
    fontWeight: "900",
    marginLeft: "5px",
  },
});

const initialErrorState = {
  firstName: { value: false, message: "" },
  lastName: { value: false, message: "" },
  email: { value: false, message: "" },
  userName: { value: false, message: "" },
  phoneNumber: { value: false, message: "" },
  password: { value: false, message: "" },
  currentPassword: { value: false, message: "" },
  newPassword: { value: false, message: "" },
  confirmNewPassword: { value: false, message: "" },
};

const UpdateProfile = ({ createProfile, updateProfile, currentProfile }) => {
  let navigate = useNavigate();
  const classes = useStyles();

  const [newAccount, setNewAccount] = useState({
    firstName:
      updateProfile && currentProfile && currentProfile.firstName
        ? currentProfile.firstName
        : "",
    lastName:
      updateProfile && currentProfile && currentProfile.lastName
        ? currentProfile.lastName
        : "",
    userName:
      updateProfile && currentProfile && currentProfile.userName
        ? currentProfile.userName
        : "",
    email:
      updateProfile && currentProfile && currentProfile.email
        ? currentProfile.email
        : "",
    password:
      updateProfile && currentProfile && currentProfile.password
        ? currentProfile.password
        : "",
    phoneNumber:
      updateProfile && currentProfile && currentProfile.phoneNumber
        ? currentProfile.phoneNumber
        : "",
  });

  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [loading, setLoading] = useState(false);
  const [displayResetPassword, setDisplayResetPassword] = useState(false);
  const [errorValue, setErrorValue] = useState(initialErrorState);

  const onChangeFirstName = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      firstName: event.target.value,
    }));
  };

  const onChangeLastName = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      lastName: event.target.value,
    }));
  };

  const onChangeUserName = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      userName: event.target.value,
    }));
  };

  const onChangeEmail = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      email: event.target.value,
    }));
  };

  const onChangePassword = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      password: event.target.value,
    }));
  };

  const onChangePhoneNumber = (event) => {
    setNewAccount((credentials) => ({
      ...newAccount,
      phoneNumber: event.target.value,
    }));
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp(
      "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
    );
    return validPassword.test(password);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.length === 10;
  };

  const errorHandler = async (id, value, message) => {
    const currentValue = JSON.parse(JSON.stringify(initialErrorState));
    currentValue[id] = { value: value, message: message };
    await setErrorValue(currentValue);
    value && setLoading(false);
  };

  const validateInput = async () => {
    const emailValidity = isValidEmail(newAccount.email);
    const passwordValidity = isValidPassword(newAccount.password);
    const phoneNumberValidity = isValidPhoneNumber(newAccount.phoneNumber);
    const firstNameValidity = newAccount.firstName.length > 0;
    const lastNameValidity = newAccount.lastName.length > 0;
    const userNameValidity = newAccount.userName.length > 3;

    const currentValue = JSON.parse(JSON.stringify(errorValue));

    !emailValidity
      ? (currentValue["email"] = {
          value: true,
          message: "Value should be a valid email.",
        })
      : (currentValue["email"] = { value: false, message: "" });
    !passwordValidity
      ? (currentValue["password"] = {
          value: true,
          message:
            "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit.",
        })
      : (currentValue["password"] = { value: false, message: "" });
    !phoneNumberValidity
      ? (currentValue["phoneNumber"] = {
          value: true,
          message: "Value should be 10 digits.",
        })
      : (currentValue["phoneNumber"] = { value: false, message: "" });
    !firstNameValidity
      ? (currentValue["firstName"] = { value: true, message: "Required" })
      : (currentValue["firstName"] = { value: false, message: "" });
    !lastNameValidity
      ? (currentValue["lastName"] = { value: true, message: "Required" })
      : (currentValue["lastName"] = { value: false, message: "" });
    !userNameValidity
      ? (currentValue["userName"] = {
          value: true,
          message: "Value must be at least 4 characters.",
        })
      : (currentValue["userName"] = { value: false, message: "" });

    await setErrorValue(currentValue);

    return (
      emailValidity &&
      passwordValidity &&
      phoneNumberValidity &&
      firstNameValidity &&
      lastNameValidity &&
      userNameValidity
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setErrorValue(initialErrorState);
    const newUser = {
      firstName: newAccount.firstName,
      lastName: newAccount.lastName,
      email: newAccount.email,
      userName: newAccount.userName,
      password: newAccount.password,
      phoneNumber: newAccount.phoneNumber,
    };

    if (createProfile && (await validateInput())) {
      setLoading(true);
      const result = await AuthClient.signup(newUser, errorHandler);
      setUserLoggedIn(true);
      setUser(result.user);
      navigate("/");
    }
    if (updateProfile && (await validateInput())) {
      setLoading(true);
      const result = await AuthClient.editProfile(newUser, errorHandler);
      setUserLoggedIn(true);
      setUser(result.user);
      navigate(`/profile/${result.user.userName}`);
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
                margin: "auto",
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
                  marginBottom: "20px",
                }}
              >
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  {displayResetPassword ? (
                    <ResetPassword
                      updateProfile={updateProfile}
                      currentProfile={currentProfile}
                    />
                  ) : (
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 2, xl: 2 }}
                        columns={{ md: 12 }}
                      >
                        <Grid item xs={8}>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "22px",
                            }}
                          >
                            {createProfile
                              ? "Create an Account"
                              : "Edit profile"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ width: "100%" }}>
                          <InputLabel>
                            <Typography>First Name</Typography>
                            <TextField
                              sx={{
                                width: "100%",
                                "& fieldset": {
                                  borderRadius: "17px",
                                },
                              }}
                              size="small"
                              required
                              value={newAccount.firstName}
                              onChange={onChangeFirstName}
                              error={errorValue["firstName"]["value"]}
                              helperText={
                                errorValue["firstName"]["value"] &&
                                errorValue["firstName"]["message"]
                              }
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
                                  borderRadius: "17px",
                                },
                              }}
                              size="small"
                              required
                              value={newAccount.lastName}
                              onChange={onChangeLastName}
                              error={errorValue["lastName"]["value"]}
                              helperText={
                                errorValue["lastName"]["value"] &&
                                errorValue["lastName"]["message"]
                              }
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
                                  borderRadius: "17px",
                                },
                              }}
                              size="small"
                              required
                              value={newAccount.userName}
                              onChange={onChangeUserName}
                              disabled={updateProfile}
                              error={errorValue["userName"]["value"]}
                              helperText={
                                errorValue["userName"]["value"] &&
                                errorValue["userName"]["message"]
                              }
                            />
                          </InputLabel>
                          <InputLabel sx={{ marginTop: "15px" }}>
                            <Typography>Phone Number</Typography>
                            <TextField
                              sx={{
                                width: "100%",
                                "& fieldset": {
                                  borderRadius: "17px",
                                },
                              }}
                              size="small"
                              required
                              placeholder={"1234567890"}
                              value={newAccount.phoneNumber}
                              onChange={onChangePhoneNumber}
                              error={errorValue["phoneNumber"]["value"]}
                              helperText={
                                errorValue["phoneNumber"]["value"] &&
                                errorValue["phoneNumber"]["message"]
                              }
                            />
                          </InputLabel>
                          <InputLabel sx={{ marginTop: "15px" }}>
                            <Typography>Email</Typography>
                            <TextField
                              sx={{
                                width: "100%",
                                "& fieldset": {
                                  borderRadius: "17px",
                                },
                              }}
                              size="small"
                              required
                              disabled={updateProfile}
                              type={"email"}
                              value={newAccount.email}
                              onChange={onChangeEmail}
                              error={errorValue["email"]["value"]}
                              helperText={
                                errorValue["email"]["value"] &&
                                errorValue["email"]["message"]
                              }
                            />
                          </InputLabel>
                          {createProfile && (
                            <InputLabel>
                              <Typography sx={{ marginTop: "15px" }}>
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
                                required
                                value={newAccount.password}
                                onChange={onChangePassword}
                                error={errorValue["password"]["value"]}
                                helperText={
                                  errorValue["password"]["value"] && (
                                    <>
                                      <span>
                                        Password should contain at least
                                      </span>
                                      <ul>
                                        <li>one upper case letter</li>
                                        <li>one lower case letter</li>
                                        <li>one special character</li>
                                        <li>one digit</li>
                                      </ul>
                                    </>
                                  )
                                }
                              />
                            </InputLabel>
                          )}
                        </Grid>
                        <Grid item md={12} sx={{ width: "100%" }}>
                          <PrimaryButton
                            onClick={handleSubmit}
                            variant="contained"
                          >
                            {createProfile ? "Sign Up" : "Save"}
                          </PrimaryButton>
                          {/* <Button
                            variant="outlined"
                            className={classes.loginBtn}
                            type="submit"
                            sx={{
                              float: "right",
                              marginLeft: "43px",
                              marginTop: "10px",
                              marginBottom: updateProfile && "15px",
                              width: "100%",
                              border: "transparent",
                              "&.MuiButtonBase-root:hover": {
                                border: "transparent",
                              },
                              borderRadius: "17px",
                              maxHeight: "35px",
                              "&.Mui-disabled": {
                                color: "#fff",
                                background: "#9E9E9E",
                              },
                            }}
                            disabled={loading}
                          >
                            {loading && (
                              <div style={{ color: "#ffffff" }}>
                                <CircularProgress
                                  size={20}
                                  color="inherit"
                                  sx={{ marginTop: "5px", marginRight: "7px" }}
                                />
                              </div>
                            )}
                            <Typography
                              variant="normalText"
                              className={classes.login}
                            >
                              {createProfile ? "Sign Up" : "Save"}
                            </Typography>
                          </Button> */}
                        </Grid>
                        {createProfile && (
                          <Grid
                            item
                            md={12}
                            sx={{
                              marginTop: "0px",
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
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
                                  fontSize: "15px",
                                }}
                              >
                                Sign in instead
                              </Typography>
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                      {updateProfile && (
                        <>
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
                              marginTop: "5px",
                              marginBottom: "30px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                onClick={() => setDisplayResetPassword(true)}
                              >
                                <Typography
                                  variant="blueText"
                                  sx={{ fontWeight: 600 }}
                                >
                                  Reset password
                                </Typography>
                              </Button>
                            </div>
                          </Box>
                        </>
                      )}
                    </Box>
                  )}
                </div>
              </Paper>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default UpdateProfile;
