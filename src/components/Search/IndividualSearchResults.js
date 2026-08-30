import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import SearchClient from "../../client/SearchClient";
import Button from "../../shared/buttons/Button";
import useInfiniteScroll from "../../shared/hooks/useInfiniteScroll";
import MediaCard from "../../shared/media/MediaCard";
import QueryErrorState from "../../shared/errors/QueryErrorState";
import IndividualSearchResultsLoading from "../../shared/loading/IndividualSearchResultsLoading";
import PeopleSearchResults from "./PeopleSearchResults";
import UserContext from "../../shared/context/userContext";
import { tokens } from "../../styles/tokens";

const IndividualSearchResults = ({
  searchKeyword,
  viewAllType,
  setViewAllMedia,
  onRefresh,
}) => {
  const { currentUser } = useContext(UserContext);
  const isPeople = viewAllType.type === "user";

  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useInfiniteQuery(
    ["searchMedia", viewAllType.type, searchKeyword],
    async ({ pageParam = 1 }) => {
      const response = await SearchClient.searchMedia(
        viewAllType.type,
        searchKeyword,
        pageParam
      );
      return {
        data: response.data.data.mediaList,
        currentPage: pageParam,
        totalPages: response.data.data.totalPages || 1,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      staleTime: 60000,
      enabled: !!searchKeyword && !!viewAllType.type && !isPeople,
    }
  );

  const {
    data: peopleResults,
    isLoading: isPeopleLoading,
    isError: isPeopleError,
    refetch: refetchPeople,
  } = useQuery({
    queryKey: ["searchPeople", searchKeyword],
    queryFn: async () => {
      const response = await SearchClient.searchMedia("user", searchKeyword, 1);
      return response.data.data.mediaList;
    },
    staleTime: 60000,
    enabled: !!searchKeyword && isPeople && !!currentUser,
  });

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewAllType.type]);

  const allItems = searchResults?.pages.flatMap((page) => page.data) ?? [];
  const people = isPeople ? peopleResults ?? [] : [];

  const showLoading = isPeople ? isPeopleLoading : isLoading;
  const showError = isPeople ? isPeopleError : isError;
  const handleRetry = isPeople ? refetchPeople : refetch;

  return (
    <Box>
      <Button
        variant="ghost"
        leftIcon={<KeyboardBackspaceIcon />}
        onClick={() => setViewAllMedia(false)}
        sx={{ mb: 2 }}
      >
        Back to results
      </Button>

      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: tokens.colors.textPrimary,
          mb: 0.5,
        }}
      >
        {viewAllType.title}
      </Typography>
      <Typography
        sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 2 }}
      >
        Results for &ldquo;{searchKeyword}&rdquo;
      </Typography>

      {showError ? (
        <QueryErrorState
          message="Unable to load search results."
          onRetry={handleRetry}
        />
      ) : null}

      {showLoading ? <IndividualSearchResultsLoading /> : null}

      {isPeople && !currentUser ? (
        <Typography sx={{ color: tokens.colors.textSecondary, py: 4 }}>
          Sign in to search for people.
        </Typography>
      ) : null}

      {!showError && !showLoading && isPeople && currentUser ? (
        <PeopleSearchResults
          people={people}
          onRefresh={onRefresh}
          variant="list"
        />
      ) : null}

      {!showError && !showLoading && !isPeople && isSuccess && allItems.length > 0 ? (
        <Grid container spacing={2}>
          {allItems.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={`${viewAllType.type}-${item.mediaId}`}>
              <MediaCard
                item={item}
                mediaType={viewAllType.type}
                variant="grid"
              />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {!showError &&
      !showLoading &&
      !isPeople &&
      isSuccess &&
      allItems.length === 0 ? (
        <Typography sx={{ color: tokens.colors.textSecondary, py: 4 }}>
          No results found.
        </Typography>
      ) : null}

      {!isPeople ? <Box ref={loadMoreRef} sx={{ minHeight: 24, py: 2 }} /> : null}

      {isFetchingNextPage ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : null}
    </Box>
  );
};

export default IndividualSearchResults;
