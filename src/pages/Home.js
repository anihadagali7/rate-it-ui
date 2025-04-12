import React, { useContext } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import RatingClient from "../client/RatingClient";
import RatingsLoading from "../shared/loading/RatingsLoading";
import UserContext from "../shared/context/userContext";
import { useQuery } from "@tanstack/react-query";
import RatingCard from "../components/ratingcard/RatingCard";
import Sidebar from "../components/header/Sidebar";
import Navbar from "../components/header/Navbar";

const Feed = ({ currentUser, feedRatingsList, exploreRatingsList }) => {
  return (
    <>
      {currentUser && feedRatingsList && feedRatingsList.length > 0 && (
        <>
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
          {feedRatingsList.map((rating) => (
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
        </>
      )}
      {exploreRatingsList && exploreRatingsList.length > 0 && (
        <>
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
          {exploreRatingsList.map((rating) => (
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
        </>
      )}
    </>
  );
};

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

  if (isLoading || (currentUser && isFeedRatingsLoading)) {
    return <RatingsLoading />;
  }

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:block">
        <Box
          sx={{
            px: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              ml: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              padding: "20px 0",
            }}
          >
            <Container>
              <Feed
                currentUser={currentUser}
                feedRatingsList={feedRatingsList}
                exploreRatingsList={exploreRatingsList}
              />
            </Container>
          </Box>
        </Box>
      </div>

      {/* Mobile layout */}

      <div className="block md:hidden">
        <Box sx={{ px: 2, py: 2 }}>
          <Feed
            currentUser={currentUser}
            feedRatingsList={feedRatingsList}
            exploreRatingsList={exploreRatingsList}
          />
        </Box>
      </div>
    </>
  );
};

export default Home;
