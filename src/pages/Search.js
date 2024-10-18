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
import { useParams } from "react-router-dom";

const DisplayMediaSearchResults = ({ searchResults, resultType, loading }) => {
  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        {loading ? (
          <SearchResultsMobileLoading />
        ) : (
          searchResults.length > 0 && (
            <SearchResultsMobile
              results={searchResults}
              resultType={resultType}
            />
          )
        )}
      </Box>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {loading ? (
          <SearchResultsDesktopLoading />
        ) : (
          searchResults.length > 0 && (
            <SearchResults results={searchResults} resultType={resultType} />
          )
        )}
      </Box>
    </>
  );
};

const Search = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTabType, setSearchTabType] = useState(0);
  const [resultType, setResultType] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const { keyword } = useParams();

  const tabItems = [
    {
      title: "Movies",
      value: 0,
      content: (
        <DisplayMediaSearchResults
          searchResults={searchResults}
          loading={loading}
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
          loading={loading}
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
          loading={loading}
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
          loading={loading}
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
          loading={loading}
          resultType={resultType}
        />
      ),
    },
  ];

  useEffect(() => {
    setSearchKeyword(keyword);
    handleSearch(keyword);
  }, [keyword]);

  useEffect(() => {
    handleSearch(searchKeyword);
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
    setLoading(false);
  };

  const handleSearch = async (searchKey) => {
    if (searchKey.length > 0) {
      setLoading(true);
      setHasSearched(true);
      const searchMapping = {
        0: "movie",
        1: "tv",
        2: "book",
        3: "music",
        4: "user",
      };
      let searchType = searchMapping[searchTabType];
      const result = await SearchClient.searchMedia(
        searchType,
        searchKey,
        setDisplayTokenModal
      );
      const finalList = result.data.mediaList;
      setResultType(result.mediaType);
      setSearchResults(finalList);
    }
    setLoading(false);
  };

  const checkToDisable = () => {
    return !searchKeyword;
  };

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginTop: "50px", marginBottom: "20px" }}
      >
        <Box
          sx={{
            width: "100%",
            height: hasSearched || loading ? "100%" : 85,
            margin: "auto",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              height: hasSearched || loading ? "100%" : 85,
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
                    />
                  </Grid>
                  <Grid item xs={3} container justifyContent="center">
                    <PrimaryButton
                      variant="contained"
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
                    handleChange={setSearchTabType}
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
