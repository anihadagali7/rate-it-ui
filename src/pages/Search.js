import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import SearchClient from "../client/SearchClient";
import SearchResults from "../components/Search/SearchResults";
import SearchResultsMobile from "../components/Search/SearchResultsMobile";
import SearchResultsDesktopLoading from "../shared/loading/SearchResultsDesktopLoading";
import SearchResultsMobileLoading from "../shared/loading/SearchResultsMobileLoading";
import LoginErrorModal from "../shared/errorModals/LoginErrorModal";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import PrimaryTabs from "../shared/tabs/PrimaryTabs";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const DisplayMediaSearchResults = ({
  searchResults,
  resultType,
  loading,
  handleSearch,
}) => {
  return (
    <>
      <Box>
        {loading ? (
          <SearchResultsDesktopLoading />
        ) : (
          searchResults.length > 0 && (
            <SearchResults
              results={searchResults}
              resultType={resultType}
              handleSearch={handleSearch}
            />
          )
        )}
      </Box>
    </>
  );
};

const Search = () => {
  const { keyword } = useParams();
  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  const [searchTabType, setSearchTabType] = useState(0);
  const [resultType, setResultType] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);

  const {
    isLoading,
    mutate: submitSearch,
    isSuccess,
    data: searchResults,
  } = useMutation({
    mutationFn: async ({ searchType }) => {
      const response = await SearchClient.searchMedia(
        searchType,
        searchKeyword
      );
      setResultType(response.data.mediaType);
      return response.data.data.mediaList;
    },
    onSuccess: () => {},
  });

  const handleSearch = async () => {
    if (searchKeyword.length > 0) {
      setHasSearched(true);
      const searchMapping = {
        0: "movie",
        1: "tv",
        2: "book",
        3: "music",
        4: "user",
      };
      let searchType = searchMapping[searchTabType];

      submitSearch({ searchType });
    }
  };

  const onKeyDownSearch = (event) => {
    if (event.key === "Enter" && searchKeyword.trim()) {
      setHasSearched(true);
      const searchMapping = {
        0: "movie",
        1: "tv",
        2: "book",
        3: "music",
        4: "user",
      };
      let searchType = searchMapping[searchTabType];

      submitSearch({ searchType });
    }
  };

  const tabItems = [
    {
      title: "Movies",
      value: 0,
      content: (
        <DisplayMediaSearchResults
          searchResults={searchResults}
          loading={isLoading}
          resultType={resultType}
        />
      ),
    },
    {
      value: 1,
      title: "TV Shows",
      content: (
        <DisplayMediaSearchResults
          searchResults={searchResults}
          loading={isLoading}
          resultType={resultType}
        />
      ),
    },
    {
      value: 2,
      title: "Books",
      content: (
        <DisplayMediaSearchResults
          searchResults={searchResults}
          loading={isLoading}
          resultType={resultType}
        />
      ),
    },
    {
      title: "Music",
      value: 3,
      content: (
        <DisplayMediaSearchResults
          searchResults={searchResults}
          loading={isLoading}
          resultType={resultType}
        />
      ),
    },
    {
      value: 4,
      title: "Users",
      content: (
        <DisplayMediaSearchResults
          searchResults={searchResults}
          loading={isLoading}
          resultType={resultType}
          handleSearch={handleSearch}
        />
      ),
    },
  ];

  useEffect(() => {
    handleSearch();
  }, [searchTabType]);

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setResultType("");
      setHasSearched(false);
    }
  };

  const resetSearch = () => {
    setSearchKeyword("");
    setResultType("");
    setHasSearched(false);
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
            height: hasSearched || isLoading ? "100%" : 85,
            margin: "auto",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              height: hasSearched || isLoading ? "100%" : 85,
              backgroundColor: "#FFFFFF",
              margin: "auto",
              borderRadius: "17px",
            }}
          >
            <div style={{ padding: "0 35px", minHeight: "385px" }}>
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
              {hasSearched && (
                <Box sx={{ marginTop: "10px" }}>
                  <PrimaryTabs
                    tabItems={tabItems}
                    activeTab={searchTabType}
                    onTabChange={setSearchTabType}
                  />
                </Box>
              )}
            </div>
          </Paper>
        </Box>
      </Container>
      {displayTokenModal && (
        <LoginErrorModal
          open={displayTokenModal}
          onClose={() => {
            resetSearch();
            setDisplayTokenModal(false);
          }}
        />
      )}
    </Box>
  );
};

export default Search;
