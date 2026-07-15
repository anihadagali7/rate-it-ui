import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import RatingClient from "../client/RatingClient";
import RatingCard from "../components/ratingcard/RatingCard";
import FeedLayout from "../shared/layout/FeedLayout";
import TabBar from "../shared/navigation/TabBar";
import RatingsLoading from "../shared/loading/RatingsLoading";
import UserContext from "../shared/context/userContext";
import QueryErrorState from "../shared/errors/QueryErrorState";
import { tokens } from "../styles/tokens";
import { useQuery } from "@tanstack/react-query";

const FEED_TABS = {
  FOLLOWING: "following",
  DISCOVER: "discover",
};

const Home = () => {
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(FEED_TABS.FOLLOWING);

  const {
    data: exploreRatingsList,
    isLoading: isExploreLoading,
    isError: isExploreError,
    refetch: refetchExplore,
  } = useQuery({
    queryKey: ["allExploreRatings"],
    queryFn: async () => await RatingClient.getAllExploreRatings(),
    staleTime: 60000,
    select: ({ data }) => data.data.ratingsList,
  });

  const {
    data: feedRatingsList,
    isLoading: isFeedLoading,
    isError: isFeedError,
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ["feedRatings"],
    queryFn: async () => await RatingClient.getFeedRatings(),
    staleTime: 60000,
    enabled: !!currentUser,
    select: ({ data }) => data.data.ratingsList,
  });

  const isLoading =
    isExploreLoading || (currentUser && isFeedLoading && activeTab === FEED_TABS.FOLLOWING);

  if (isLoading) {
    return <RatingsLoading />;
  }

  if (isExploreError && (!currentUser || activeTab === FEED_TABS.DISCOVER)) {
    return (
      <FeedLayout>
        <QueryErrorState
          message="Unable to load explore ratings."
          onRetry={refetchExplore}
        />
      </FeedLayout>
    );
  }

  const isFollowingTab =
    currentUser && activeTab === FEED_TABS.FOLLOWING;

  const ratingsToShow = isFollowingTab ? feedRatingsList : exploreRatingsList;

  const shouldShowRatings = isFollowingTab
    ? !isFeedError && feedRatingsList?.length > 0
    : exploreRatingsList?.length > 0;

  return (
    <FeedLayout>
      {currentUser ? (
        <TabBar
          tabs={[
            { id: FEED_TABS.FOLLOWING, label: "Following" },
            { id: FEED_TABS.DISCOVER, label: "Discover" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      ) : null}

      {currentUser && activeTab === FEED_TABS.FOLLOWING && isFeedError ? (
        <QueryErrorState
          message="Unable to load your feed."
          onRetry={refetchFeed}
        />
      ) : null}

      {currentUser &&
      activeTab === FEED_TABS.FOLLOWING &&
      !isFeedError &&
      feedRatingsList?.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: tokens.colors.surface,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: tokens.colors.textPrimary,
              mb: 1,
            }}
          >
            Your feed is empty
          </Typography>
          <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
            Follow people to see their reviews here, or switch to Discover.
          </Typography>
        </Box>
      ) : null}

      {shouldShowRatings ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {ratingsToShow?.map((rating) => (
            <RatingCard rating={rating} key={rating._id} />
          ))}
        </Box>
      ) : null}

      {!currentUser && exploreRatingsList?.length === 0 && !isExploreError ? (
        <Typography
          sx={{ textAlign: "center", color: tokens.colors.textSecondary, py: 4 }}
        >
          No reviews yet. Be the first to rate something!
        </Typography>
      ) : null}
    </FeedLayout>
  );
};

export default Home;
