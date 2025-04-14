import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Container, Paper, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import WishlistClient from "../client/WishlistClient";
import UserContext from "../shared/context/userContext";
import ProfileWishlistLoading from "../shared/loading/ProfileWishlistLoading";

const Wishlist = () => {
  const { userName } = useParams();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.profileUserName;
  const userViewingOwnProfile = userName === profileUserName;

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

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginBottom: "25px", marginTop: "25px" }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            minHeight: "300px",
            height: "100%",
            backgroundColor: "#FFFFFF",
            margin: "auto",
            borderRadius: "17px",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              minHeight: "100vh",
              padding: 2,
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "22px",
              }}
            >
              Wishlist
            </Typography>
            <List component="nav">
              {isLoading ? (
                <ProfileWishlistLoading />
              ) : (
                wishlistList &&
                wishlistList.length > 0 &&
                wishlistList.map((media) => (
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
                                {media.addedBy.firstName}{" "}
                                {media.addedBy.lastName}
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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Wishlist;
