import React from "react";
import StickyBox from "react-sticky-box";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { makeStyles } from "@mui/styles";

import { Provider } from "jotai";
import { theme } from "../Theme/Theme";
import {
  Container,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

const useStyles = makeStyles({
  container: {
    margin: "20px 35px",
  },
  searchBtn: {
    backgroundColor: "#f4afc2",
    "&:hover": {
      backgroundColor: "#f4afc2",
    },
  },
  search: {
    fontWeight: "900",
    fontSize: "15px",
  },
});

const Sidebar = () => {
  const classes = useStyles();

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: 128,
                height: 128,
              },
              float: "right",
              marginTop: "35px",
            }}
          >
            <Paper elevation={6}>
              <div>Hello</div>
            </Paper>
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Sidebar;
