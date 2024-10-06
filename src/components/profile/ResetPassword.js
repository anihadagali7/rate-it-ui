import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Provider, useAtom } from "jotai";
import { theme } from "../../Theme/Theme";
import AuthClient from "../../client/AuthClient";
import { currentlyLoggedIn, currentUser } from "../../state/user";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const initialErrorState = {
  currentPassword: { value: false, message: "" },
  newPassword: { value: false, message: "" },
  confirmNewPassword: { value: false, message: "" },
};

const ResetPassword = ({ currentProfile }) => {
  let navigate = useNavigate();

  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);

  const [errorValue, setErrorValue] = useState(initialErrorState);
  const [payload, setPayload] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp(
      "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
    );
    return validPassword.test(password);
  };

  const validatePasswordReset = async () => {
    const newPasswordValidity = isValidPassword(payload.newPassword);
    const confirmNewPasswordValidity =
      payload.newPassword === payload.confirmNewPassword;

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
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    };

    if (await validatePasswordReset()) {
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
  };

  const checkToDisable = () => {
    return !(
      payload.hasOwnProperty("currentPassword") &&
      payload.currentPassword !== "" &&
      payload.hasOwnProperty("newPassword") &&
      payload.newPassword !== "" &&
      payload.hasOwnProperty("confirmNewPassword") &&
      payload.confirmNewPassword !== ""
    );
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
                            name="currentPassword"
                            required
                            value={payload.currentPassword}
                            onChange={handleChange}
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
                            value={payload.newPassword}
                            name="newPassword"
                            onChange={handleChange}
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
                            value={payload.confirmNewPassword}
                            name="confirmNewPassword"
                            onChange={handleChange}
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
                        <PrimaryButton
                          onClick={resetPasswordSubmit}
                          disabled={checkToDisable()}
                          variant="contained"
                        >
                          Reset
                        </PrimaryButton>
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
