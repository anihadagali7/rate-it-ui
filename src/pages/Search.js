import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SearchClient from "../client/SearchClient";
import UpdatedSearchResults from "../components/Search/UpdateSearchResults";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";

const Search = () => {
  const { keyword } = useParams();
  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  const [hasSearched, setHasSearched] = useState(false);

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
            height: hasSearched || isLoading ? "100%" : 85,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              height: hasSearched || isLoading ? "100%" : 85,
              backgroundColor: "#FFFFFF",
              borderRadius: "17px",
            }}
          >
            <div style={{ padding: "0 15px", minHeight: "385px" }}>
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
              {isSuccess && (
                <UpdatedSearchResults
                  searchResults={searchResults}
                  loading={isLoading}
                  searchQuery={searchKeyword}
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
