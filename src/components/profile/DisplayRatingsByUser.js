import React from "react";
import RatingClient from "../../client/RatingClient";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import ProfileRatingsLoading from "../../shared/loading/ProfileRatingsLoading";
import { useQuery } from "@tanstack/react-query";
import RatingCard from "../ratingcard/RatingCard";

const DisplayRatingsByUser = ({ profileUserName }) => {
  const { data: ratingsList, isLoading } = useQuery({
    queryKey: ["ratingsForUser", { profileUserName }],
    queryFn: async () => await RatingClient.getAllRatingsForUser(profileUserName),
    staleTime: 60000,
    enabled: !!profileUserName,
    select: ({ data }) => data.data.ratingsList,
  });

  if (isLoading) {
    return <ProfileRatingsLoading />;
  }

  return (
    <Box>
      {ratingsList &&
        ratingsList.length > 0 &&
        ratingsList.map((rating) => (
          <>
            <RatingCard rating={rating}/>
            <Divider
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
