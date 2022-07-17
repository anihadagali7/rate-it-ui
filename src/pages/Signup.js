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
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import AuthClient from "../client/AuthClient";
import { currentUser, currentlyLoggedIn } from "../state/user";
import { useAtom } from "jotai";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";

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

const Signup = () => {
  const classes = useStyles();
  const [newAccount, setNewAccount] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);

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

  const handleSignup = async () => {
    // const result = await AuthClient.login(login.email, login.password);
    // if (result.status === "success") {
    //   console.log("result success ");
    //   setUserLoggedIn(true);
    //   setUser(result.data.user);
    // }
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
                          Create an Account
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <InputLabel>
                          <Typography>First Name</Typography>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            value={newAccount.firstName}
                            onChange={onChangeFirstName}
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography>Last Name</Typography>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            value={newAccount.lastName}
                            onChange={onChangeLastName}
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography>Username</Typography>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            value={newAccount.userName}
                            onChange={onChangeUserName}
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography>Phone Number</Typography>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            value={newAccount.phoneNumber}
                            onChange={onChangePhoneNumber}
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography>Email</Typography>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            type={"email"}
                            value={newAccount.email}
                            onChange={onChangeEmail}
                          />
                        </InputLabel>
                        <InputLabel>
                          <Typography sx={{ marginTop: "10px" }}>
                            Password
                          </Typography>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            type={"password"}
                            value={newAccount.password}
                            onChange={onChangePassword}
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item xs={8} sx={{ marginTop: "8px" }}>
                        <Typography
                          sx={{
                            marginTop: "10px",
                            fontWeight: "bold",
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
                          onClick={handleSignup}
                          sx={{ float: "right" }}
                        >
                          <Typography
                            variant="normalText"
                            className={classes.login}
                          >
                            Sign Up
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
