import React, { useEffect, useState } from "react";
import RatingClient from "../client/RatingClient";
import { theme } from "../Theme/Theme";
import {
  Box,
  Container,
  StyledEngineProvider,
  ThemeProvider, Typography
} from "@mui/material";
import { Provider, useAtom } from "jotai";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import moment from "moment";

const DisplayRatingsByUser = ({ user }) => {
  const [ratingsList, setRatingsList] = useState([]);

  useEffect(() => {
    getRatingsForUser();
  }, [user]);

  const getRatingsForUser = async () => {
    const result = await RatingClient.getAllRatingsForUser(user.userName);
    setRatingsList(result.data.ratingsList);
  };

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    return "" + timeAgo.split(" ")[0] + units[0]
  }

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              width: "100%",
              height: "100%"

            }}
          >
            <List component="nav">
              {ratingsList && ratingsList.length > 0 ? ratingsList.map((rating) => (
                  <>
                    <ListItem>
                      <Stack
                        direction="row"
                        spacing={2}
                      >
                        <>
                          <Avatar
                            sx={{ bgcolor: "#00a8ff", textDecoration: "none", marginTop: "auto", marginBottom: "auto" }}
                            component={Link}
                            to={`/profile/${rating.ratedBy.userName}`}
                          >
                            {rating.ratedBy.firstName[0]}
                            {rating.ratedBy.lastName[0]}
                          </Avatar>
                          <div>
                            <Stack direction="column">
                                <span style={{ fontWeight: "bold" }}>
                                  {rating.ratedBy.firstName} {rating.ratedBy.lastName}
                                  <span style={{ fontWeight: "normal" }}> @{rating.ratedBy.userName}</span>
                                <span style={{ fontWeight: "normal" }}> &#8226; {getTimeAgo(rating.dateCreated)}</span>
                                </span>
                              <span>
                                  <Typography component={Link} sx={{textDecoration: "none"}}
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
                    </ListItem>
                    <Divider sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }} />
                  </>
                )) :
                <div>No following</div>}
            </List>
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default DisplayRatingsByUser;