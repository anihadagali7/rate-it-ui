import {
  Container,
  Grid,
  Paper,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { Provider } from "jotai";
import React from "react";
import { theme } from "../../Theme/Theme";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";

const SearchResultsMobile = ({ results }) => {
  const listItem = (row, index) => (
    <Grid item xs={6} sx={{ paddingLeft: index % 2 == 0 ? "0px" : "20px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div>
          <ListItemAvatar sx={{ marginTop: "15px" }}>
            <img
              width={150}
              height={200}
              style={{ marginBottom: "10px" }}
              alt="poster"
              src={row.poster ? row.poster : NotFoundImage}
            />
          </ListItemAvatar>
        </div>
      </Box>
    </Grid>
  );

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}></ThemeProvider>
        <Divider sx={{ marginTop: "30px" }} />
        <Container
          maxWidth={"sm"}
          sx={{
            "&.MuiContainer-root": {
              marginLeft: "-23px !important",
              paddingRight: "0px !important",
            },
          }}
        >
          <Grid container>
            {results.map((row, index) => listItem(row, index))}
          </Grid>
        </Container>
      </StyledEngineProvider>
    </Provider>
  );
};

export default SearchResultsMobile;
