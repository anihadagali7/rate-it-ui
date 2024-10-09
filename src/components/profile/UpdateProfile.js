import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { isMobile } from "react-device-detect";
import Grid from "@mui/material/Grid";
import {
  Container,
  InputLabel,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { theme } from "../../Theme/Theme";
import { Provider, useAtom } from "jotai";
import { currentlyLoggedIn, currentUser } from "../../state/user";
import AuthClient from "../../client/AuthClient";
import Divider from "@mui/material/Divider";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import ResetPassword from "./ResetPassword";

const initialErrorState = {
  firstName: { value: false, message: "" },
  lastName: { value: false, message: "" },
  email: { value: false, message: "" },
  userName: { value: false, message: "" },
  phoneNumber: { value: false, message: "" },
  password: { value: false, message: "" },
};

const UpdateProfile = ({ createProfile, updateProfile, currentProfile }) => {
  let navigate = useNavigate();

  const [payload, setPayload] = useState({
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

  const [prevProfileValues] = useState(payload);
  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [displayResetPassword, setDisplayResetPassword] = useState(false);
  const [errorValue, setErrorValue] = useState(initialErrorState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
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
  };

  const validateInput = async () => {
    const emailValidity = isValidEmail(payload.email);
    const passwordValidity = isValidPassword(payload.password);
    const phoneNumberValidity = isValidPhoneNumber(payload.phoneNumber);
    const firstNameValidity = payload.firstName.length > 0;
    const lastNameValidity = payload.lastName.length > 0;
    const userNameValidity = payload.userName.length > 3;

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

  const checkToDisable = () => {
    const { firstName, lastName, phoneNumber, userName, email, password } =
      payload;

    const hasRequiredFields =
      firstName && lastName && userName && phoneNumber && email && password;

    const isSameProfile =
      prevProfileValues.firstName === firstName &&
      prevProfileValues.lastName === lastName &&
      prevProfileValues.phoneNumber === phoneNumber;

    return isSameProfile || !hasRequiredFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setErrorValue(initialErrorState);
    const newUser = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      userName: payload.userName,
      password: payload.password,
      phoneNumber: payload.phoneNumber,
    };

    if (createProfile && (await validateInput())) {
      const result = await AuthClient.signup(newUser, errorHandler);
      setUserLoggedIn(true);
      setUser(result.user);
      navigate("/");
    }
    if (updateProfile && (await validateInput())) {
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
                    <ResetPassword currentProfile={currentProfile} />
                  ) : (
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
                              value={payload.firstName}
                              name="firstName"
                              onChange={handleChange}
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
                              value={payload.lastName}
                              onChange={handleChange}
                              name="lastName"
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
                              value={payload.userName}
                              name="userName"
                              onChange={handleChange}
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
                              value={payload.phoneNumber}
                              name="phoneNumber"
                              onChange={handleChange}
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
                              value={payload.email}
                              name="email"
                              onChange={handleChange}
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
                                value={payload.password}
                                name="password"
                                onChange={handleChange}
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
                        <Grid item xs={12} container justifyContent="end">
                          <PrimaryButton
                            onClick={handleSubmit}
                            disabled={checkToDisable()}
                            variant="contained"
                          >
                            {createProfile ? "Sign Up" : "Save"}
                          </PrimaryButton>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider
                            variant="middle"
                            sx={{
                              marginTop: "25px",
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          container
                          justifyContent="center"
                          sx={{ marginBottom: "15px" }}
                        >
                          {updateProfile && (
                            <PrimaryButton
                              testId="loginInstead"
                              variant="text"
                              onClick={() => setDisplayResetPassword(true)}
                            >
                              Reset password
                            </PrimaryButton>
                          )}
                          {createProfile && (
                            <PrimaryButton
                              testId="loginInstead"
                              buttonElement={Link}
                              variant="text"
                              link="/login"
                            >
                              Sign in instead
                            </PrimaryButton>
                          )}
                        </Grid>
                      </Grid>
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
