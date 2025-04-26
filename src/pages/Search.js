import { Container, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SearchClient from "../client/SearchClient";
import CarouselSearchResults from "../components/Search/CarouselSearchResults";
import IndividualSearchResults from "../components/Search/IndividualSearchResults";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import SearchResultsDesktopLoading from "../shared/loading/SearchResultsDesktopLoading";
import { isDesktop } from "react-device-detect";
import SearchResultsMobileLoading from "../shared/loading/SearchResultsMobileLoading";

const Search = () => {
  const { keyword } = useParams();
  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [viewAllMedia, setViewAllMedia] = useState(false);
  const [viewAllType, setViewAllType] = useState({ type: "", title: "" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    isLoading,
    isSuccess,
    mutate: submitSearch,
    data: searchResults,
  } = useMutation({
    mutationFn: async () => {
      const response = await SearchClient.searchAllMedia(searchKeyword);
      return response.data.data.fullSearchList;
    },
    onSuccess: () => {},
  });

  const handleSearch = async () => {
    if (searchKeyword.length > 0) {
      setHasSearched(true);
      submitSearch();
    }
  };

  const onKeyDownSearch = (event) => {
    if (event.key === "Enter" && searchKeyword.trim()) {
      setHasSearched(true);
      submitSearch();
    }
  };

  useEffect(() => {
    setViewAllMedia(false);
    handleSearch();
  }, []);

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setHasSearched(false);
    }
  };

  const checkToDisable = () => {
    return !searchKeyword;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth={"md"}
        sx={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Box
          sx={{
            width: "100%",
            height: hasSearched ? "100%" : 85,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              height: hasSearched ? "100%" : 85,
              backgroundColor: "#FFFFFF",
              borderRadius: "17px",
            }}
          >
            <div style={{ padding: "0 15px", minHeight: "385px" }}>
              {!viewAllMedia && (
                <Box sx={{ paddingTop: "20px" }}>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 2, xl: 5 }}
                    columns={{ xs: 12 }}
                  >
                    <Grid item xs={9}>
                      <PrimaryInputField
                        value={searchKeyword}
                        name="search"
                        onChange={onChangeSearch}
                        onKeyDown={onKeyDownSearch}
                      />
                    </Grid>
                    <Grid item xs={3} container justifyContent="center">
                      <PrimaryButton
                        variant="contained"
                        buttonElement={Link}
                        link={
                          searchKeyword.length > 0 && `/search/${searchKeyword}`
                        }
                        onClick={() => handleSearch(searchKeyword)}
                        disabled={checkToDisable()}
                      >
                        Search
                      </PrimaryButton>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {isLoading && (isTablet || isDesktop) && (
                <SearchResultsDesktopLoading />
              )}
              {isLoading && isMobile && <SearchResultsMobileLoading />}
              {isSuccess && !viewAllMedia && (
                <CarouselSearchResults
                  searchResults={searchResults}
                  loading={isLoading}
                  searchQuery={searchKeyword}
                  setViewAllMedia={setViewAllMedia}
                  setViewAllType={setViewAllType}
                />
              )}
              {viewAllMedia && hasSearched && (
                <IndividualSearchResults
                  searchKeyword={searchKeyword}
                  viewAllType={viewAllType}
                  setViewAllMedia={setViewAllMedia}
                />
              )}
            </div>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Search;
