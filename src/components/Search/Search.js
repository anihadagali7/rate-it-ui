import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { Provider } from "jotai";
import { theme } from "../../Theme/Theme";
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
import MicIcon from "@mui/icons-material/Mic";
import Tooltip from "@mui/material/Tooltip";
import SearchClient from "../../client/SearchClient";
import SearchResults from "./SearchResults";

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

const Search = () => {
  const classes = useStyles();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
            <MicIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const handleSearch = async () => {
    if (searchKeyword.length > 0) {
      console.log("media type ", mediaType, searchKeyword);
      const result = await SearchClient.searchMedia(mediaType, searchKeyword);
      console.log("result of api ", result);
      const finalList = result.data.results;
      setSearchResults(finalList);
    }
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
            <Box
              sx={{
                width: "100%",
                height: 225,
                margin: "auto",
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  // maxHeight: 250,
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
                          className={classes.searchBtn}
                          onClick={handleSearch}
                          sx={{
                            float: "right",
                            border: "transparent",
                            "&.MuiButtonBase-root:hover": {
                              border: "transparent",
                            },
                          }}
                        >
                          <Typography
                            variant="normalText"
                            className={classes.search}
                          >
                            Search
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  <SearchResults results={searchResults} />
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
