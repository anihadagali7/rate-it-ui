import React from "react";
import RatingClient from "../../client/RatingClient";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import ProfileRatingsLoading from "../../shared/loading/ProfileRatingsLoading";
import { useQuery } from "@tanstack/react-query";
import RatingCard from "../ratingcard/RatingCard";
import QueryErrorState from "../../shared/errors/QueryErrorState";

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
        message="Unable to load ratings."
        onRetry={refetch}
      />
    );
  }

  return (
    <Box>
      {ratingsList &&
        ratingsList.length > 0 &&
        ratingsList.map((rating, index) => (
          <>
            <RatingCard key={rating._id} rating={rating} />
            <Divider
              key={index}
              sx={{
                margin: "20px 5px",
              }}
            />
          </>
        ))}
    </Box>
  );
};

export default DisplayRatingsByUser;
