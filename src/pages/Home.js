import React, { useContext, useState } from "react";
import RatingClient from "../client/RatingClient";
import FeedList from "../components/feed/FeedList";
import FeedLayout from "../shared/layout/FeedLayout";
import TabBar from "../shared/navigation/TabBar";
import RatingsLoading from "../shared/loading/RatingsLoading";
import EmptyState from "../shared/primitives/EmptyState";
import UserContext from "../shared/context/userContext";
import QueryErrorState from "../shared/errors/QueryErrorState";
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

  const isFollowingTab =
    currentUser && activeTab === FEED_TABS.FOLLOWING;

  const isLoading =
    isExploreLoading || (currentUser && isFeedLoading && isFollowingTab);

  if (isLoading) {
    return <RatingsLoading />;
  }

  if (isExploreError && (!currentUser || !isFollowingTab)) {
    return (
      <FeedLayout>
        <QueryErrorState
          message="Unable to load explore ratings."
          onRetry={refetchExplore}
        />
      </FeedLayout>
    );
  }

  const ratingsToShow = isFollowingTab ? feedRatingsList : exploreRatingsList;

  const shouldShowRatings = isFollowingTab
    ? !isFeedError && feedRatingsList?.length > 0
    : exploreRatingsList?.length > 0;

  return (
    <FeedLayout showRail={!!currentUser}>
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

      {currentUser && isFollowingTab && isFeedError ? (
        <QueryErrorState
          message="Unable to load your feed."
          onRetry={refetchFeed}
        />
      ) : null}

      {currentUser &&
      isFollowingTab &&
      !isFeedError &&
      feedRatingsList?.length === 0 ? (
        <EmptyState
          title="Your feed is empty"
          description="Follow people to see their reviews here, or switch to Discover."
        />
      ) : null}

      {shouldShowRatings ? (
        <FeedList ratings={ratingsToShow} />
      ) : null}

      {!currentUser && exploreRatingsList?.length === 0 && !isExploreError ? (
        <EmptyState
          title="No reviews yet"
          description="Be the first to rate something!"
        />
      ) : null}
    </FeedLayout>
  );
};

export default Home;
