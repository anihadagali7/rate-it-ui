import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchClient from "../client/SearchClient";
import CarouselSearchResults from "../components/Search/CarouselSearchResults";
import IndividualSearchResults from "../components/Search/IndividualSearchResults";
import PeopleSearchResults from "../components/Search/PeopleSearchResults";
import Button from "../shared/buttons/Button";
import FeedLayout from "../shared/layout/FeedLayout";
import FilterChips from "../shared/navigation/FilterChips";
import PrimaryInputField from "../shared/inputfield/PrimaryInputField";
import SearchResultsDesktopLoading from "../shared/loading/SearchResultsDesktopLoading";
import QueryErrorState from "../shared/errors/QueryErrorState";
import SurfaceCard from "../shared/primitives/SurfaceCard";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV" },
  { id: "music", label: "Music" },
  { id: "book", label: "Books" },
  { id: "user", label: "People" },
];

const FILTER_TITLES = {
  movie: "Movies",
  tv: "TV Shows",
  music: "Music",
  book: "Books",
  user: "People",
};

const Search = () => {
  const { keyword } = useParams();
  const { currentUser } = useContext(UserContext);
  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewAllMedia, setViewAllMedia] = useState(false);
  const [viewAllType, setViewAllType] = useState({ type: "", title: "" });

  const {
    isLoading,
    isSuccess,
    isError,
    mutate: submitSearch,
    data: searchData,
  } = useMutation({
    mutationFn: async () => {
      const [mediaResponse, peopleResponse] = await Promise.all([
        SearchClient.searchAllMedia(searchKeyword),
        SearchClient.searchMedia("user", searchKeyword, 1),
      ]);

      return {
        media: mediaResponse.data.data.fullSearchList,
        people: peopleResponse.data.data.mediaList,
      };
    },
  });

  const runSearch = () => {
    if (searchKeyword.trim().length > 0) {
      setHasSearched(true);
      setActiveFilter("all");
      setViewAllMedia(false);
      submitSearch();
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);

    if (filterId === "all") {
      setViewAllMedia(false);
      return;
    }

    setViewAllType({ type: filterId, title: FILTER_TITLES[filterId] });
    setViewAllMedia(true);
  };

  const handleViewAll = (type, title) => {
    setActiveFilter(type);
    setViewAllType({ type, title });
    setViewAllMedia(true);
  };

  const onKeyDownSearch = (event) => {
    if (event.key === "Enter" && searchKeyword.trim()) {
      runSearch();
    }
  };

  useEffect(() => {
    if (keyword) {
      setSearchKeyword(keyword);
      setHasSearched(true);
      submitSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setHasSearched(false);
      setViewAllMedia(false);
      setActiveFilter("all");
    }
  };

  const hasAnyResults = () => {
    if (!searchData) return false;
    const { media, people } = searchData;
    const hasMedia = Object.values(media || {}).some((list) => list?.length > 0);
    const hasPeople = people?.length > 0;
    return hasMedia || hasPeople;
  };

  return (
    <FeedLayout showRail={!!currentUser}>
      <SurfaceCard padding={2.5} sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            mb: 0.5,
          }}
        >
          Search
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 2 }}
        >
          Find movies, shows, music, books, and people
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <PrimaryInputField
              value={searchKeyword}
              name="search"
              placeholder="Search movies, shows, music, books, people..."
              onChange={onChangeSearch}
              onKeyDown={onKeyDownSearch}
            />
          </Box>
          <Button
            variant="primary"
            onClick={runSearch}
            disabled={!searchKeyword.trim()}
            sx={{ mt: 0, minWidth: 96 }}
          >
            Search
          </Button>
        </Box>
      </SurfaceCard>

      {hasSearched ? (
        <FilterChips
          options={FILTER_OPTIONS}
          activeId={activeFilter}
          onChange={handleFilterChange}
        />
      ) : null}

      {isLoading ? <SearchResultsDesktopLoading /> : null}

      {isError ? (
        <QueryErrorState
          message="Unable to load search results."
          onRetry={() => submitSearch()}
        />
      ) : null}

      {isSuccess && !isError && hasSearched && !viewAllMedia && activeFilter === "all" ? (
        <>
          {!hasAnyResults() ? (
            <SurfaceCard padding={3}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: tokens.colors.textPrimary,
                  mb: 0.5,
                }}
              >
                No results found
              </Typography>
              <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
                Try different keywords or browse another category.
              </Typography>
            </SurfaceCard>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <CarouselSearchResults
                searchResults={searchData.media}
                setViewAllMedia={(value) => {
                  if (value) setViewAllMedia(true);
                }}
                setViewAllType={(typeInfo) => handleViewAll(typeInfo.type, typeInfo.title)}
              />
              <PeopleSearchResults
                people={searchData.people}
                onRefresh={() => submitSearch()}
              />
            </Box>
          )}
        </>
      ) : null}

      {viewAllMedia && hasSearched && activeFilter !== "all" ? (
        <IndividualSearchResults
          searchKeyword={searchKeyword}
          viewAllType={viewAllType}
          setViewAllMedia={(value) => {
            setViewAllMedia(value);
            if (!value) setActiveFilter("all");
          }}
          onRefresh={() => submitSearch()}
        />
      ) : null}
    </FeedLayout>
  );
};

export default Search;
