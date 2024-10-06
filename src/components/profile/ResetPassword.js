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
import { makeStyles } from "@mui/styles";
import { Provider, useAtom } from "jotai";
import { theme } from "../../Theme/Theme";
import AuthClient from "../../client/AuthClient";
import { currentlyLoggedIn, currentUser } from "../../state/user";

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

const ResetPassword = ({ updateProfile, currentProfile }) => {
  let navigate = useNavigate();
  const classes = useStyles();

  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [loading, setLoading] = useState(false);

  const [errorValue, setErrorValue] = useState(initialErrorState);
  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [displayResetPassword, setDisplayResetPassword] = useState(false);

  const onChangeCurrentPassword = (event) => {
    setResetPassword((credentials) => ({
      ...resetPassword,
      currentPassword: event.target.value,
    }));
  };

  const onChangeNewPassword = (event) => {
    setResetPassword((credentials) => ({
      ...resetPassword,
      newPassword: event.target.value,
    }));
  };

  const onChangeConfirmNewPassword = (event) => {
    setResetPassword((credentials) => ({
      ...resetPassword,
      confirmNewPassword: event.target.value,
    }));
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp(
      "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
    );
    return validPassword.test(password);
  };

  const validatePasswordReset = async () => {
    const newPasswordValidity = isValidPassword(resetPassword.newPassword);
    const confirmNewPasswordValidity =
      resetPassword.newPassword === resetPassword.confirmNewPassword;

    const currentValue = JSON.parse(JSON.stringify(errorValue));

    !newPasswordValidity
      ? (currentValue["newPassword"] = {
          value: true,
          message:
            "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit.",
        })
      : (currentValue["newPassword"] = { value: false, message: "" });

    !confirmNewPasswordValidity
      ? (currentValue["confirmNewPassword"] = {
          value: true,
          message: "Passwords should be equal",
        })
      : (currentValue["confirmNewPassword"] = { value: false, message: "" });

    await setErrorValue(currentValue);

    return newPasswordValidity && confirmNewPasswordValidity;
  };

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();
    const errorValueCopy = JSON.parse(JSON.stringify(initialErrorState));
    await setErrorValue(errorValueCopy);

    const passwordRequest = {
      userName: currentProfile.userName,
      currentPassword: resetPassword.currentPassword,
      newPassword: resetPassword.newPassword,
    };

    if (await validatePasswordReset()) {
      setLoading(true);
      const result = await AuthClient.resetPassword(
        passwordRequest,
        errorHandler
      );
      setUserLoggedIn(true);
      setUser(result.user);
      navigate(`/profile/${result.user.userName}`);
    }
  };

  const errorHandler = async (id, value, message) => {
    const currentValue = JSON.parse(JSON.stringify(initialErrorState));
    currentValue[id] = { value: value, message: message };
    await setErrorValue(currentValue);
    value && setLoading(false);
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
                  <Box component="form" onSubmit={resetPasswordSubmit}>
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
                          Reset password
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography sx={{ marginTop: "15px" }}>
                            Current Password
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
                            value={resetPassword.currentPassword}
                            onChange={onChangeCurrentPassword}
                            error={errorValue["currentPassword"]["value"]}
                            helperText={
                              errorValue["currentPassword"]["value"] && (
                                <>
                                  <span>Current password is not valid</span>
                                </>
                              )
                            }
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography sx={{ marginTop: "15px" }}>
                            New Password
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
                            value={resetPassword.newPassword}
                            onChange={onChangeNewPassword}
                            error={errorValue["newPassword"]["value"]}
                            helperText={
                              errorValue["newPassword"]["value"] && (
                                <>
                                  <span>Password should contain at least</span>
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
                      </Grid>
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography sx={{ marginTop: "15px" }}>
                            Re-enter new password
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
                            value={resetPassword.confirmNewPassword}
                            onChange={onChangeConfirmNewPassword}
                            error={errorValue["confirmNewPassword"]["value"]}
                            helperText={
                              errorValue["confirmNewPassword"]["value"] && (
                                <>
                                  <span>Passwords are not equal</span>
                                </>
                              )
                            }
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item md={12} sx={{ width: "100%" }}>
                        <Button
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
                            Reset
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

export default ResetPassword;
