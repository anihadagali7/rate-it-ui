import React from "react";
import moment from "moment/moment";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";

const RatingCard = ({ rating }) => {
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
    <Stack direction="row" spacing={2}>
      <Avatar
        sx={{
          bgcolor: "#00a8ff",
          textDecoration: "none",
        }}
        component={Link}
        src={AccountCircleIcon}
        to={`/profile/${rating?.ratedBy?.userName}`}
      />
      <Stack direction="column">
        <span style={{ fontWeight: "bold" }}>
          {rating?.ratedBy?.firstName} {rating?.ratedBy?.lastName}
          <span style={{ fontWeight: "normal" }}>
            {" "}
            @{rating?.ratedBy?.userName}
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
    </Stack>
  );
};

export default RatingCard;
