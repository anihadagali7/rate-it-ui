import { Box, Typography } from "@mui/material";
import RatingClient from "../../client/RatingClient";
import FeedList from "../feed/FeedList";
import ProfileRatingsLoading from "../../shared/loading/ProfileRatingsLoading";
import QueryErrorState from "../../shared/errors/QueryErrorState";
import { tokens } from "../../styles/tokens";
import { useQuery } from "@tanstack/react-query";

const DisplayRatingsByUser = ({ profileUserName }) => {
  const {
    data: ratingsList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ratingsForUser", { profileUserName }],
    queryFn: async () =>
      await RatingClient.getAllRatingsForUser(profileUserName),
    staleTime: 60000,
    enabled: !!profileUserName,
    select: ({ data }) => data.data.ratingsList,
  });

  if (isLoading) {
    return <ProfileRatingsLoading />;
  }

  if (isError) {
    return (
      <QueryErrorState
        message="Unable to load reviews."
        onRetry={refetch}
      />
    );
  }

  if (!ratingsList?.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          px: 2,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: `${tokens.radius.card}px`,
          backgroundColor: tokens.colors.surface,
        }}
      >
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            mb: 0.5,
          }}
        >
          No reviews yet
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
          Ratings will show up here once this user starts reviewing media.
        </Typography>
      </Box>
    );
  }

  return <FeedList ratings={ratingsList} />;
};

export default DisplayRatingsByUser;
