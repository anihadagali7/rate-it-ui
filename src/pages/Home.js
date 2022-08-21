import React, { useEffect, useState } from "react";
import { Provider } from "jotai";
import { Box, Container, Paper, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { theme } from "../Theme/Theme";
import RatingClient from "../client/RatingClient";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import moment from "moment/moment";

const Home = () => {
  const [ratingsList, setRatingsList] = useState([]);

  const getAllExploreRatings = async () => {
    const result = await RatingClient.getAllExploreRatings();
    setRatingsList(result.data.ratingsList);
  };

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    return "" + timeAgo.split(" ")[0] + units[0];
  };

  useEffect(() => {
    getAllExploreRatings();
  });
  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {ratingsList && ratingsList.length > 0 && ratingsList.map((rating) => (
            <>
              <Container maxWidth={"sm"} sx={{ marginTop: "10px" }}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    margin: "auto"
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFFFFF",
                      margin: "auto",
                      borderRadius: "17px"
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{margin: '15px 0 15px 15px', paddingTop: '25px'}}
                    >
                      <>
                        <Avatar
                          sx={{ bgcolor: "#00a8ff", textDecoration: "none", marginTop: "auto", marginBottom: "auto" }}
                          component={Link}
                          src={AccountCircleIcon}
                          to={`/profile/${rating.ratedBy.userName}`}
                        />
                        <div>
                          <Stack direction="column">
                                <span style={{ fontWeight: "bold" }}>
                                  {rating.ratedBy.firstName} {rating.ratedBy.lastName}
                                  <span style={{ fontWeight: "normal" }}> @{rating.ratedBy.userName}</span>
                                <span style={{ fontWeight: "normal" }}> &#8226; {getTimeAgo(rating.dateCreated)}</span>
                                </span>
                            <span>
                                  <Typography component={Link} sx={{ textDecoration: "none" }}
                                              to={`/${rating.media.mediaType}/${rating.media.mediaId}`}>
                                   -{rating.media.name}
                                </Typography>
                              </span>
                            <Typography>Rating: {rating.rating}</Typography>
                            <Typography>Comments: {rating.comments}</Typography>
                          </Stack>
                        </div>
                      </>
                    </Stack>
                    <Divider sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }} />
                  </Paper>
                </Box>
              </Container>
            </>
          ))}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Home;
