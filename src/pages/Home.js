import React from "react";
import { Provider } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../Theme/Theme";
import Search from "../components/Search/Search";
import Sidebar from "../components/Sidebar";


const Home = () => {
  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* <Sidebar /> */}
          <Search />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Home;
