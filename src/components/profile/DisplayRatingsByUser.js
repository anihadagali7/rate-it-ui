import React from "react";
import RatingClient from "../../client/RatingClient";
import { Box, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import moment from "moment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileRatingsLoading from "../../shared/loading/ProfileRatingsLoading";
import { useQuery } from "@tanstack/react-query";

const DisplayRatingsByUser = ({ userName }) => {
  const { data: ratingsList, isLoading } = useQuery({
    queryKey: ["ratingsForUser", { userName }],
    queryFn: async () => await RatingClient.getAllRatingsForUser(userName),
    staleTime: 60000,
    enabled: !!userName,
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

  return (
    <Box>
      <List>
        {isLoading ? (
          <ProfileRatingsLoading />
        ) : (
          ratingsList &&
          ratingsList.length > 0 &&
          ratingsList.map((rating) => (
            <>
              <ListItem>
                <Stack direction="row" spacing={2} key={rating._id}>
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
                          {rating.ratedBy.firstName} {rating.ratedBy.lastName}
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
                            sx={{ textDecoration: "none" }}
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
              </ListItem>
              <Divider />
            </>
          ))
        )}
      </List>
    </Box>
  );
};

export default DisplayRatingsByUser;
