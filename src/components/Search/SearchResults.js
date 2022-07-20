import {
  Container,
  Grid,
  Paper,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { Provider } from "jotai";
import React, { useEffect, useState } from "react";
import { theme } from "../../Theme/Theme";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";

const SearchResults = ({ results }) => {
  const listItem = (row) => (
    <ListItem sx={{ width: 700 }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Grid container spacing={{ xs: 2, md: 2, xl: 2 }} columns={{ md: 12 }}>
          <Grid item xs={3}>
            <div>
              <ListItemAvatar>
                <img width={100} height={150} alt="poster" src={row.poster} />
              </ListItemAvatar>
            </div>
          </Grid>
          <Grid item xs={7}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {row.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {row.description}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    </ListItem>
  );

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}></ThemeProvider>
        <Divider sx={{ marginTop: "30px" }} />
        <Container
          maxWidth={"sm"}
          sx={{ "&.MuiContainer-root": { marginLeft: "-37px !important" } }}
        >
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {results.map((row, index) => (
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
                              alt="Remy Sharp"
                              src={row.poster}
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
                            variant="h5"
                            sx={{ marginTop: "10px" }}
                          >
                            {row.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
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
            ))}
          </List>
        </Container>
      </StyledEngineProvider>
    </Provider>
  );
};

export default SearchResults;
