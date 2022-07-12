import React from "react";
import { Provider } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../Theme/Theme";
import Header from "../components/header/Header";

const Login = () => {
  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Header displayMenu={false}/>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Login;
