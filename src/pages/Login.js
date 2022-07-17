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
import Header from "../components/header/Header";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import AuthClient from "../client/AuthClient";
import { currentUser, currentlyLoggedIn } from "../state/user";
import { useAtom } from "jotai";

const useStyles = makeStyles({
  container: {
    margin: "20px 35px",
  },
  loginBtn: {
    backgroundColor: "#f4afc2",
  },
  login: {
    fontWeight: "900",
  },
});

const Login = () => {
  const classes = useStyles();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useAtom(currentUser);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);

  const onChangeEmail = (event) => {
    setLogin((credentials) => ({ ...login, email: event.target.value }));
  };

  const onChangePassword = (event) => {
    setLogin((credentials) => ({ ...login, password: event.target.value }));
  };

  const handleLogin = async () => {
    const result = await AuthClient.login(login.email, login.password);
    if (result.status === "success") {
      console.log("result success ");
      setUserLoggedIn(true);
      setUser(result.data.user);
    }
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Header displayMenu={false} />
          <Container fixed maxWidth={"md"}>
            <Box className={classes.container}>
              <Grid
                container
                spacing={{ xs: 2, md: 2, xl: 5 }}
                columns={{ md: 12 }}
              >
                <Grid item xs={8}>
                  Sign In
                </Grid>
                <Grid item xs={4}>
                  or create an account
                </Grid>
                <Grid item xs={4}>
                  <InputLabel>
                    <Typography>Email</Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      value={login.email}
                      onChange={onChangeEmail}
                    />
                  </InputLabel>
                  <InputLabel>
                    <Typography>Password</Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      type={"password"}
                      value={login.password}
                      onChange={onChangePassword}
                    />
                  </InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <div>Forgot your password?</div>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    className={classes.loginBtn}
                    onClick={handleLogin}
                  >
                    <Typography variant="normalText" className={classes.login}>
                      Sign In
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Login;
