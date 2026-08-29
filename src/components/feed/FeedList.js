import { Box } from "@mui/material";
import RatingCard from "../ratingcard/RatingCard";
import useClientPagination from "../../shared/hooks/useClientPagination";
import useInfiniteScroll from "../../shared/hooks/useInfiniteScroll";

const FEED_PAGE_SIZE = 10;

const FeedList = ({ ratings = [], hideMedia = false }) => {
  const { visibleItems, hasMore, loadMore } = useClientPagination(
    ratings,
    FEED_PAGE_SIZE
  );

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: false,
  });

  if (!ratings.length) {
    return null;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {visibleItems.map((rating) => (
          <RatingCard rating={rating} hideMedia={hideMedia} key={rating._id} />
        ))}
      </Box>

      <Box ref={loadMoreRef} sx={{ minHeight: 24, py: 1 }} />
    </>
  );
};

export default FeedList;
