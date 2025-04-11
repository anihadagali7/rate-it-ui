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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
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
      </Box>
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
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", md: "flex" },
          px: 2,
        }}
      >
        <Box display="flex" width="100%">
          <Sidebar />
          <Box
            sx={{
              flexGrow: 1,
              ml: 2,
              display: "flex",
              flexDirection: "column",
              maxWidth: "66%",
              padding: "20px 0"
            }}
          >
            <Feed
              currentUser={currentUser}
              feedRatingsList={feedRatingsList}
              exploreRatingsList={exploreRatingsList}
            />
          </Box>
        </Box>
      </Box>

      {/* Mobile layout */}
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Navbar />
        <Box sx={{ m: 2, padding: "10px 20px 20px 20px" }}>
          <Feed
            currentUser={currentUser}
            feedRatingsList={feedRatingsList}
            exploreRatingsList={exploreRatingsList}
          />
        </Box>
      </Box>
    </>
  );
};

export default Home;
