import React, { useContext } from "react";
import { Container, Paper, Typography } from "@mui/material";
import RatingClient from "../client/RatingClient";
import RatingsLoading from "../shared/loading/RatingsLoading";
import UserContext from "../shared/context/userContext";
import { useQuery } from "@tanstack/react-query";
import RatingCard from "../components/ratingcard/RatingCard";

const Home = () => {
  const { currentUser } = useContext(UserContext);

  const { data: exploreRatingsList, isLoading } = useQuery({
    queryKey: ["allExploreRatings"],
    queryFn: async () => await RatingClient.getAllExploreRatings(),
    staleTime: 60000,
    select: ({ data }) => data.data.ratingsList,
  });

  const { data: feedRatingsList, isLoading: isFeedRatingsLoading } = useQuery({
    queryKey: ["feedRatings"],
    queryFn: async () =>
      await RatingClient.getFeedRatings(currentUser.userName),
    staleTime: 60000,
    enabled: !!currentUser,
    select: ({ data }) => data.data.ratingsList,
  });

  if (isLoading || isFeedRatingsLoading) {
    return <RatingsLoading />;
  }

  return (
    <Container maxWidth={"sm"} sx={{ marginTop: "10px", marginBottom: "25px" }}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "22px",
          paddingTop: "15px",
          paddingLeft: "25px",
        }}
      >
        For you
      </Typography>
      {feedRatingsList &&
        feedRatingsList.length > 0 &&
        feedRatingsList.map((rating) => (
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "17px",
              marginTop: "15px",
              padding: "25px",
            }}
          >
            <RatingCard rating={rating} key={rating.id} />
          </Paper>
        ))}
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "22px",
          paddingTop: "15px",
          paddingLeft: "25px",
        }}
      >
        Explore
      </Typography>
      {exploreRatingsList &&
        exploreRatingsList.length > 0 &&
        exploreRatingsList.map((rating) => (
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "17px",
              marginTop: "15px",
              padding: "25px",
            }}
          >
            <RatingCard rating={rating} key={rating.id} />
          </Paper>
        ))}
    </Container>
  );
};

export default Home;
