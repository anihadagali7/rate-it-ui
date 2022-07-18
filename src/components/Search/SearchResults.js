import {
  Container,
  Grid,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { Provider } from "jotai";
import React from "react";
import { theme } from "../../Theme/Theme";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const SearchResults = ({ searchResults }) => {
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
            <ListItem sx={{ width: 700 }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Grid
                  container
                  spacing={{ xs: 2, md: 2, xl: 2 }}
                  columns={{ md: 12 }}
                >
                  <Grid item xs={3}>
                    <div>
                      <ListItemAvatar>
                        <img
                          width={100}
                          height={150}
                          alt="Remy Sharp"
                          src="https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
                        />
                      </ListItemAvatar>
                    </div>
                  </Grid>
                  <Grid item xs={7}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography component="div" variant="h5">
                        Live From Space
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                      >
                        Mac Miller
                      </Typography>
                    </CardContent>
                  </Grid>

                  {/* <Box
                    sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                  >
                    <IconButton aria-label="previous">
                      <SkipPreviousIcon />
                    </IconButton>
                    <IconButton aria-label="play/pause">
                      <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="next">
                      <SkipNextIcon />
                    </IconButton>
                  </Box> */}
                </Grid>
              </Box>
            </ListItem>
          </List>
        </Container>
      </StyledEngineProvider>
    </Provider>
  );
};

export default SearchResults;
