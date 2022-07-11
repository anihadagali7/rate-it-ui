import React from "react";
import { Provider } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../Theme/Theme";
import Header from "../components/header/Header";

const Home = () => {
  console.log("inside home");
  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Header />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Home;
