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

const SearchResults = ({ results, resultType }) => {
  const listItem = (row) => (
    <ListItem
      sx={{
        width: 525,
        "&.MuiListItem-root": { marginLeft: "-12px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: 500,
            borderRadius: "17px",
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 2, xl: 2 }}
            columns={{ md: 12 }}
            sx={{ "&.MuiGrid-root": { marginLeft: "16px" } }}
          >
            <Grid
              item
              xs={2}
              sx={{
                "&.MuiGrid-root": { marginLeft: "-16px !important" },
              }}
            >
              <div>
                <ListItemAvatar sx={{ marginTop: "15px" }}>
                  <img
                    width={100}
                    height={150}
                    style={{ marginBottom: "10px" }}
                    alt="poster"
                    src={row.poster ? row.poster : NotFoundImage}
                  />
                </ListItemAvatar>
              </div>
            </Grid>
            <Grid
              item
              xs={7}
              sx={{
                marginTop: "0px",
                marginRight: "50px",
              }}
            >
              <div style={{ marginLeft: "40px", width: "100%" }}>
                <Typography
                  component="div"
                  sx={{
                    marginTop: "10px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {row.name.length > 25
                    ? `${row.name.substring(0, 25)}...`
                    : row.name}
                </Typography>
                <Typography component="div">
                  {row.description.length > 100
                    ? `${row.description.substring(0, 100)}...`
                    : row.description}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ListItem>
  );

  const listItemMusic = (row) => {
    return (
      <ListItem
        sx={{
          width: 700,
          "&.MuiListItem-root": { marginLeft: "-12px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "17px",
          }}
        >
          <Paper elevation={8} sx={{ width: 500 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 2, xl: 2 }}
              columns={{ md: 12 }}
              sx={{ "&.MuiGrid-root": { marginLeft: "16px" } }}
            >
              <Grid
                item
                xs={2}
                sx={{
                  "&.MuiGrid-root": { marginLeft: "-16px !important" },
                }}
              >
                <div>
                  <ListItemAvatar sx={{ marginTop: "15px" }}>
                    <img
                      width={100}
                      height={150}
                      style={{ marginBottom: "10px" }}
                      alt="poster"
                      src={row.poster ? row.poster : NotFoundImage}
                    />
                  </ListItemAvatar>
                </div>
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  marginTop: "0px",
                  marginRight: "50px",
                }}
              >
                <div style={{ marginLeft: "40px", width: "100%" }}>
                  <Typography
                    component="div"
                    sx={{
                      marginTop: "10px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {row.name} {row.albumType === "album" && ", " + row.albumName}
                  </Typography>
                  <Typography component="div">
                    {row.artists.length > 100
                      ? `${row.artists.substring(0, 100)}...`
                      : row.artists}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </ListItem>
    );
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}></ThemeProvider>
        <Divider sx={{ marginTop: "30px" }} />
        <Container
          maxWidth={"sm"}
          sx={{ "&.MuiContainer-root": { marginLeft: "-37px !important" } }}
        >
          <List sx={{ width: "100%", maxWidth: 360 }}>
            {resultType === "music" &&
              results.map((row, index) => listItemMusic(row))}
            {(resultType === "movie" || resultType === "tv") &&
              results.map((row, index) => listItem(row))}
          </List>
        </Container>
      </StyledEngineProvider>
    </Provider>
  );
};

export default SearchResults;
