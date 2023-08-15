import React, { useEffect, useState } from "react";
import RatingClient from "../../client/RatingClient";
import { theme } from "../../Theme/Theme";
import { Box, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { Provider } from "jotai";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import moment from "moment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileRatingsLoading from "../../shared/loading/ProfileRatingsLoading";

const DisplayRatingsByUser = ({ user }) => {
  const [ratingsList, setRatingsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRatingsForUser();
  }, [user]);

  const getRatingsForUser = async () => {
    setLoading(true);
    const result = await RatingClient.getAllRatingsForUser(user.userName);
    setRatingsList(result.data.ratingsList.reverse());
    setLoading(false);
  };

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    if(units.includes("second") || units.includes("minute") || units.includes("day")){
      return "" + timeAgo.split(" ")[0] + units[0];
    }
    else {
      return moment(date).format("M-D-YY");
    }
  }

  const displayRatings = () => {
    return <>
      {ratingsList && ratingsList.length > 0 && ratingsList.map((rating) => (
        <>
          <ListItem>
            <Stack
              direction="row"
              spacing={2}
              key={rating._id}
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
          </ListItem>
          <Divider sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }} />
        </>
      ))}
    </>;
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
              {loading ? (<ProfileRatingsLoading />) : displayRatings()}
            </List>
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default DisplayRatingsByUser;
