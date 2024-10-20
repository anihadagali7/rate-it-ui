import React, { useContext, useEffect } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import RatingClient from "../client/RatingClient";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import moment from "moment/moment";
import RatingsLoading from "../shared/loading/RatingsLoading";
import UserContext from "../shared/context/userContext";
import { useQuery } from "@tanstack/react-query";

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
    select: ({ data }) => data.data.ratingsList,
  });

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    if (
      units.includes("second") ||
      units.includes("minute") ||
      units.includes("day")
    ) {
      return "" + timeAgo.split(" ")[0] + units[0];
    } else {
      return moment(date).format("M-D-YY");
    }
  };

  const displayExploreRatings = () => {
    return (
      exploreRatingsList &&
      exploreRatingsList.length > 0 && (
        <Container
          maxWidth={"sm"}
          sx={{ marginTop: "10px", marginBottom: "15px" }}
        >
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
            <>
              <Container maxWidth={"sm"} sx={{ marginTop: "10px" }}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    margin: "auto",
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFFFFF",
                      margin: "auto",
                      borderRadius: "17px",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ margin: "15px 0 15px 15px", paddingTop: "25px" }}
                    >
                      <>
                        <Avatar
                          sx={{
                            bgcolor: "#00a8ff",
                            textDecoration: "none",
                            marginTop: "auto",
                            marginBottom: "auto",
                          }}
                          component={Link}
                          src={AccountCircleIcon}
                          to={`/profile/${rating.ratedBy.userName}`}
                        />
                        <div>
                          <Stack direction="column">
                            <span style={{ fontWeight: "bold" }}>
                              {rating.ratedBy.firstName}{" "}
                              {rating.ratedBy.lastName}
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                @{rating.ratedBy.userName}
                              </span>
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                &#8226; {getTimeAgo(rating.dateCreated)}
                              </span>
                            </span>
                            <span>
                              <Typography
                                component={Link}
                                sx={{
                                  textDecoration: "none",
                                  color: "gray",
                                  fontStyle: "italic",
                                }}
                                to={`/${rating.media.mediaType}/${rating.media.mediaId}`}
                              >
                                -{rating.media.name}
                              </Typography>
                            </span>
                            <Typography>Rating: {rating.rating}</Typography>
                            <Typography>Comments: {rating.comments}</Typography>
                          </Stack>
                        </div>
                      </>
                    </Stack>
                    <Divider
                      sx={{
                        width: "95%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </Paper>
                </Box>
              </Container>
            </>
          ))}
        </Container>
      )
    );
  };

  return (
    <Box>
      {feedRatingsList && feedRatingsList.length > 0 && (
        <Container
          maxWidth={"sm"}
          sx={{ marginTop: "10px", marginBottom: "25px" }}
        >
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
            <>
              <Container maxWidth={"sm"} sx={{ marginTop: "10px" }}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    margin: "auto",
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFFFFF",
                      margin: "auto",
                      borderRadius: "17px",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        margin: "15px 0 15px 15px",
                        paddingTop: "25px",
                      }}
                    >
                      <>
                        <Avatar
                          sx={{
                            bgcolor: "#00a8ff",
                            textDecoration: "none",
                            marginTop: "auto",
                            marginBottom: "auto",
                          }}
                          component={Link}
                          src={AccountCircleIcon}
                          to={`/profile/${rating.ratedBy.userName}`}
                        />
                        <div>
                          <Stack direction="column">
                            <span style={{ fontWeight: "bold" }}>
                              {rating.ratedBy.firstName}{" "}
                              {rating.ratedBy.lastName}
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                @{rating.ratedBy.userName}
                              </span>
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                &#8226; {getTimeAgo(rating.dateCreated)}
                              </span>
                            </span>
                            <span>
                              <Typography
                                component={Link}
                                sx={{
                                  textDecoration: "none",
                                  color: "gray",
                                  fontStyle: "italic",
                                }}
                                to={`/${rating.media.mediaType}/${rating.media.mediaId}`}
                              >
                                -{rating.media.name}
                              </Typography>
                            </span>
                            <Typography>Rating: {rating.rating}</Typography>
                            <Typography>Comments: {rating.comments}</Typography>
                          </Stack>
                        </div>
                      </>
                    </Stack>
                    <Divider
                      sx={{
                        width: "95%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </Paper>
                </Box>
              </Container>
            </>
          ))}
        </Container>
      )}
      {isLoading ? <RatingsLoading /> : displayExploreRatings()}
    </Box>
  );
};

export default Home;
