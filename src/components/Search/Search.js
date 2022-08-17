import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { Provider } from "jotai";
import { theme } from "../../Theme/Theme";
import { Container, StyledEngineProvider, TextField, ThemeProvider } from "@mui/material";
import SearchClient from "../../client/SearchClient";
import SearchResults from "./SearchResults";
import SearchResultsMobile from "./SearchResultsMobile";
import SearchResultsDesktopLoading from "../../shared/loading/SearchResultsDesktopLoading";
import SearchResultsMobileLoading from "../../shared/loading/SearchResultsMobileLoading";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const useStyles = makeStyles({
  container: {
    margin: "20px 35px"
  },
  searchBtn: {
    backgroundColor: "#f4afc2",
    "&:hover": {
      backgroundColor: "#f4afc2"
    }
  },
  search: {
    fontWeight: "900",
    fontSize: "15px"
  }
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
};

const Search = () => {
  const classes = useStyles();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTabType, setSearchTabType] = useState(0);
  const [resultType, setResultType] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const changeSearchTabType = (event, search) => {
    setSearchTabType(search);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTabType]);

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setSearchResults([]);
      setResultType("");
      setHasSearched(false);
    }
  };

  const resetSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
    setResultType("");
    setHasSearched(false);
  };

  const handleSearch = async () => {
    if (searchKeyword.length > 0) {
      setLoading(true);
      setHasSearched(true);
      const searchMapping = {
        0: "movie",
        1: "tv",
        2: "music"
        // 3: "",
      };
      let searchType = searchMapping[searchTabType];
      const result = await SearchClient.searchMedia(searchType, searchKeyword);
      const finalList = result.data.mediaList;
      setResultType(result.mediaType);
      setSearchResults(finalList);
    }
    setLoading(false);
  };

  const displayMediaSearchResults = () => (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        {loading ? (
          <SearchResultsMobileLoading />
        ) : searchResults.length > 0 && (
          <SearchResultsMobile
            results={searchResults}
            resultType={resultType}
          />
        )}
      </Box>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {loading ? (
          <SearchResultsDesktopLoading />
        ) : searchResults.length > 0 && (
          <SearchResults
            results={searchResults}
            resultType={resultType}
          />
        )}
      </Box>
    </>
  );

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
            <Box
              sx={{
                width: "100%",
                height: (searchResults.length > 0) || loading ? "100%" : 85,
                margin: "auto"
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  height: (searchResults.length > 0) || loading ? "100%" : 85,
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  borderRadius: "17px"
                }}
              >
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  <Box>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 2, xl: 5 }}
                      columns={{ md: 12 }}
                    >
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <Paper elevation={4}
                               component="form"
                               sx={{
                                 p: "2px 4px",
                                 display: "flex",
                                 alignItems: "center",
                                 width: "auto",
                                 borderRadius: "17px"
                               }}
                        >
                          <TextField
                            sx={{
                              width: "100%",
                              "& fieldset": {
                                border: "none"
                              }
                            }}
                            size="small"
                            placeholder="Search Rate It"
                            value={searchKeyword}
                            onChange={onChangeSearch}
                            required
                          />
                          {searchKeyword.length > 0 && (
                            <IconButton sx={{ p: "10px" }} onClick={resetSearch}>
                              <ClearIcon />
                            </IconButton>
                          )}
                          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                          <IconButton sx={{ p: "10px" }} onClick={handleSearch}>
                            <SearchIcon />
                          </IconButton>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                  {hasSearched && (
                    <Box sx={{ width: "100%", marginTop: "10px" }}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={searchTabType}
                          onChange={changeSearchTabType}
                          variant="scrollable"
                          allowScrollButtonsMobile
                          sx={{ color: "#00a8ff" }}
                          TabIndicatorProps={{ style: { background: "#00a8ff" } }}
                        >
                          <Tab
                            sx={{
                              fontSize: "13px",
                              "&.Mui-selected": {
                                color: "#40a9ff",
                                fontSize: "13px"
                              },
                              "&.Mui-focusVisible": {
                                backgroundColor: "#40a9ff"
                              }
                            }}
                            label="Movies"
                          />
                          <Tab
                            sx={{
                              fontSize: "13px",
                              "&.Mui-selected": {
                                color: "#40a9ff",
                                fontSize: "13px"
                              },
                              "&.Mui-focusVisible": {
                                backgroundColor: "#40a9ff"
                              }
                            }}
                            label="TV Shows"
                          />
                          <Tab
                            sx={{
                              fontSize: "13px",
                              "&.Mui-selected": {
                                color: "#40a9ff",
                                fontSize: "13px"
                              },
                              "&.Mui-focusVisible": {
                                backgroundColor: "#40a9ff"
                              }
                            }}
                            label="Music"
                          />
                          <Tab
                            sx={{
                              fontSize: "13px",
                              "&.Mui-selected": {
                                color: "#40a9ff",
                                fontSize: "13px"
                              },
                              "&.Mui-focusVisible": {
                                backgroundColor: "#40a9ff"
                              }
                            }}
                            label="Users"
                          />
                        </Tabs>
                      </Box>
                      <TabPanel value={searchTabType} index={0}>
                        {displayMediaSearchResults()}
                      </TabPanel>
                      <TabPanel value={searchTabType} index={1}>
                        {displayMediaSearchResults()}
                      </TabPanel>
                      <TabPanel value={searchTabType} index={2}>
                        {displayMediaSearchResults()}
                      </TabPanel>
                      <TabPanel value={searchTabType} index={3}>
                        Users
                      </TabPanel>
                    </Box>
                  )}
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
