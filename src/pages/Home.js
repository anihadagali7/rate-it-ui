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
    queryFn: async () => await RatingClient.getFeedRatings(),
    staleTime: 60000,
    enabled: !!currentUser,
    select: ({ data }) => data.data.ratingsList,
  });

  if (isLoading || (currentUser && isFeedRatingsLoading)) {
    return <RatingsLoading />;
  }

  return (
    <Container maxWidth={"md"} sx={{ marginBottom: "25px", marginTop: "25px" }}>
      {currentUser && feedRatingsList && feedRatingsList.length > 0 && (
        <>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "22px",
            }}
          >
            For you
          </Typography>
          {feedRatingsList.map((rating) => (
            <Paper
              elevation={6}
              key={rating._id}
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
        </>
      )}
      {exploreRatingsList && exploreRatingsList.length > 0 && (
        <>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "22px",
              paddingTop: "15px",
            }}
          >
            Explore
          </Typography>
          {exploreRatingsList.map((rating) => (
            <Paper
              elevation={6}
              key={rating._id}
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
        </>
      )}
    </Container>
  );
};

export default Home;
