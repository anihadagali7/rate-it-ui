import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { Provider } from "jotai";
import { theme } from "../Theme/Theme";
import {
  Container,
  InputLabel,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MovieIcon from "@mui/icons-material/Movie";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import Tooltip from "@mui/material/Tooltip";

const useStyles = makeStyles({
  container: {
    margin: "20px 35px",
  },
  loginBtn: {
    backgroundColor: "#f4afc2",
    "&:hover": {
      backgroundColor: "#f4afc2",
    },
  },
  login: {
    fontWeight: "900",
    fontSize: "15px",
  },
});

const Search = () => {
  const classes = useStyles();
  const [searchKeyword, setSearchKeyword] = useState("");

  const [mediaType, setMediaType] = useState("movie");

  const handleMediaType = (event, media) => {
    if (media !== null) {
      setMediaType(media);
    }
  };

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const mediaTypeToggle = () => (
    <Stack direction="row" spacing={4}>
      <ToggleButtonGroup value={mediaType} exclusive onChange={handleMediaType}>
        <ToggleButton value="movie">
          <Tooltip title="Movie">
            <MovieIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="tv">
          <Tooltip title="TV Show">
            <LiveTvIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="book">
          <Tooltip title="Book">
            <MenuBookIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="song">
          <Tooltip title="Song">
            <MusicNoteIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="theatre">
          <Tooltip title="Theatre Play">
            <TheaterComedyIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="podcast">
          <Tooltip title="Podcast">
            <HeadsetMicIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
            <Box
              sx={{
                width: "100%",
                height: 250,
                margin: "auto",
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  maxHeight: 275,
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                }}
              >
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  <Box>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 2, xl: 5 }}
                      columns={{ md: 12 }}
                    >
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          Search for your favorite media
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        {mediaTypeToggle()}
                      </Grid>
                      <Grid item xs={9} sx={{ width: "100%" }}>
                        <InputLabel>
                          <TextField
                            sx={{ width: "100%" }}
                            size="small"
                            placeholder="Search for your favorite media"
                            value={searchKeyword}
                            onChange={onChangeSearch}
                            required
                          />
                        </InputLabel>
                      </Grid>
                      <Grid item xs={3}>
                        <Button
                          variant="outlined"
                          className={classes.loginBtn}
                          sx={{ float: "right" }}
                        >
                          <Typography
                            variant="normalText"
                            className={classes.login}
                          >
                            Search
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              </Paper>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Search;
