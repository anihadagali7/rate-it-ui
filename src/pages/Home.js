import React from "react";
import { Provider } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../Theme/Theme";

const Home = () => {
  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div>Home</div>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Home;
