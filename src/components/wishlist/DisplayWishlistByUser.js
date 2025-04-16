import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Container, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import WishlistClient from "../../client/WishlistClient";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const DisplayWishlistByUser = ({ userName, profileView }) => {
  const { data: wishlistList, isLoading } = useQuery({
    queryKey: ["getAllWishlistForUser", userName],
    queryFn: async () => await WishlistClient.getAllWishlistForUser(userName),
    staleTime: 60000,
    select: ({ data }) => data.data.wishlistList,
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

  let newList = [];
  if (wishlistList) {
    if (profileView) {
      newList = wishlistList.splice(0, 3);
    } else {
      newList = wishlistList;
    }
  }

  return (
    <Box>
      <List component="nav">
        {isLoading ? (
          <ProfileWishlistLoading />
        ) : (
          newList &&
          newList.length > 0 &&
          newList.map((media) => (
            <>
              <ListItem key={media._id}>
                <Stack direction="row" spacing={2}>
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
                      to={`/profile/${media.addedBy.userName}`}
                    />
                    <div>
                      <Stack direction="column">
                        <span style={{ fontWeight: "bold" }}>
                          {media.addedBy.firstName} {media.addedBy.lastName}
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            @{media.addedBy.userName}
                          </span>
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            &#8226; {getTimeAgo(media.dateCreated)}
                          </span>
                        </span>
                        <span>
                          <Typography
                            component={Link}
                            sx={{ textDecoration: "none" }}
                            to={`/${media.media.mediaType}/${media.media.mediaId}`}
                          >
                            {media.media.name}
                          </Typography>
                        </span>
                      </Stack>
                    </div>
                  </>
                </Stack>
              </ListItem>
              <Divider
                sx={{
                  width: "95%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </>
          ))
        )}
      </List>
      {profileView && (
        <Box sx={{ margin: "10px", justifyContent: "center", display: "flex" }}>
          <PrimaryButton
            variant="outlined"
            buttonElement={Link}
            link={`/wishlist/${userName}`}
          >
            See all wishlists
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
};

export default DisplayWishlistByUser;
