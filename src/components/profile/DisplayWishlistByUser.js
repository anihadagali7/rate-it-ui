import React, { useEffect, useState } from "react";
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
import WishlistClient from "../../client/WishlistClient";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";

const DisplayWishlistByUser = ({ user }) => {
  const [wishlistList, setWishlistList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWishlistForUser();
  }, [user]);

  const getWishlistForUser = async () => {
    setLoading(true);
    const result = await WishlistClient.getAllWishlistForUser(user.userName);
    setWishlistList(result.data.wishlistList.reverse());
    setLoading(false);
  };

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    if (units.includes("second") || units.includes("minute") || units.includes("day")) {
      return "" + timeAgo.split(" ")[0] + units[0];
    } else {
      return moment(date).format("M-D-YY");
    }
  };

  const displayWishlist = () => {
    return <>
      {wishlistList && wishlistList.length > 0 && wishlistList.map((media) => (
        <>
          <ListItem key={media._id}>
            <Stack
              direction="row"
              spacing={2}
            >
              <>
                <Avatar
                  sx={{ bgcolor: "#00a8ff", textDecoration: "none", marginTop: "auto", marginBottom: "auto" }}
                  component={Link}
                  src={AccountCircleIcon}
                  to={`/profile/${media.addedBy.userName}`}
                />
                <div>
                  <Stack direction="column">
                                <span style={{ fontWeight: "bold" }}>
                                  {media.addedBy.firstName} {media.addedBy.lastName}
                                  <span style={{ fontWeight: "normal" }}> @{media.addedBy.userName}</span>
                                <span style={{ fontWeight: "normal" }}> &#8226; {getTimeAgo(media.dateCreated)}</span>
                                </span>
                    <span>
                                  <Typography component={Link} sx={{ textDecoration: "none" }}
                                              to={`/${media.media.mediaType}/${media.media.mediaId}`}>
                                   {media.media.name}
                                </Typography>
                              </span>
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
              {loading ? (<ProfileWishlistLoading />) : displayWishlist()}
            </List>
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default DisplayWishlistByUser;
