import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, Popover, StyledEngineProvider,
  ThemeProvider, Typography
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import UserClient from "../../client/UserClient";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
};

const FriendsModal = ({ open, onClose, userName, openingTab, currentUser }) => {
  const [tabValue, setTabValue] = useState(openingTab);
  const [followingList, setFollowingList] = useState({});
  const [followersList, setFollowersList] = useState({});
  const [updateList, setUpdateList] = useState(false);

  const [unfollowPopover, setUnfollowPopover] = useState(false);
  const openPopover = Boolean(unfollowPopover);

  const getFollowers = async () => {
    const result = await UserClient.getFollowers(userName);
    setFollowersList(result.data);
  };

  const getFollowing = async () => {
    const result = await UserClient.getFollowing(userName);
    setFollowingList(result.data);
  };

  useEffect(() => {
    getFollowers();
    getFollowing();
  }, [updateList]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUnFollowPopoverClose = () => {
    setUnfollowPopover(null);
  };

  const handleUnFollowPopoverOpen = (event) => {
    setUnfollowPopover((event.currentTarget));
  };

  const displayFollowingButton = (profile) => {
    let currentlyFollows = currentUser.following.includes(profile);
    let text = currentlyFollows ? "Following" : "Follow";
    let buttonType = currentlyFollows ? "outlined" : "contained";
    return (
      <>
        <Button
          variant={buttonType}
          sx={{
            borderRadius: "17px",
            width: "100%",
            height: "30px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: currentlyFollows ? "#ffffff" : "#00a8ff"
          }}
          // onClick={currentlyFollows ? unFollowUser(currentUser.userName, profile) : followUser(currentUser.userName, profile)}
          onClick={handleUnFollowPopoverOpen}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: currentlyFollows ? "#00a8ff" : "#ffffff",
                        fontWeight: "bold"
                      }}
          >
            {text}
          </Typography>
        </Button>
        <Popover
          open={openPopover}
          anchorEl={unfollowPopover}
          onClose={handleUnFollowPopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <Button variant="outlined" endIcon={<PersonRemoveIcon />}>
            Unfollow @{profile}
          </Button>
        </Popover>
      </>
    );
  };

  const determineActionButtonFollowingList = (profile) => {
    if (profile.userName === currentUser.userName) {
      return (
        <></>
      );
    } else if (profile && profile.followers && profile.followers.includes(currentUser && currentUser.userName)) {
      return (
        <Button
          variant="outlined"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%"
          }}
          onClick={() => unFollowUser(currentUser.userName, profile.userName)}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#00a8ff",
                        fontWeight: "bold"
                      }}
          >
            Following
          </Typography>
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%",
            backgroundColor: "#00a8ff"
          }}
          onClick={() => followUser(currentUser.userName, profile.userName)}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#ffffff",
                        fontWeight: "bold"
                      }}
          >
            Follow
          </Typography>
        </Button>
      );
    }
  };

  const determineActionButtonFollowersList = (profile) => {
    if (profile.userName === currentUser.userName) {
      return (
        <></>
      );
    }
    else if (profile && profile.followers && profile.followers.includes(currentUser && currentUser.userName)) {
      return (
        <Button
          variant="outlined"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%"
          }}
          onClick={() => unFollowUser(currentUser.userName, profile.userName)}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#00a8ff",
                        fontWeight: "bold"
                      }}
          >
            Following
          </Typography>
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%",
            backgroundColor: "#00a8ff"
          }}
          onClick={() => followUser(currentUser.userName, profile.userName)}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#ffffff",
                        fontWeight: "bold"
                      }}
          >
            Follow
          </Typography>
        </Button>
      );
    }
  };

  const unFollowUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.unFollowUser(currentUser, userToUnfollow);
    result == 200 && setUpdateList(!updateList);
  };

  const followUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.followUser(currentUser, userToUnfollow);
    result == 200 && setUpdateList(!updateList);
  };

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{ "& .MuiDialog-paper": { width: "100%", height: 300, maxWidth: 500, overflowY: "hidden" } }}>
              <DialogTitle
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "0px",
                  textAlign: "center"
                }}>{userName}</DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    variant="fullWidth"
                    onChange={handleTabChange}
                    sx={{ color: "#00a8ff" }}
                    TabIndicatorProps={{ style: { background: "#00a8ff" } }}
                  >
                    <Tab
                      sx={{
                        fontSize: "13px",
                        "&.Mui-selected": {
                          color: "#40a9ff",
                          fontSize: "13px"
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff"
                        }
                      }}
                      label="Following"
                    />
                    <Tab
                      sx={{
                        fontSize: "13px",
                        "&.Mui-selected": {
                          color: "#40a9ff",
                          fontSize: "13px"
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff"
                        }
                      }}
                      label="Followers"
                    />
                  </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                  <List component="nav" style={{ maxHeight: 200, overflow: "auto" }}>
                    {followingList && followingList.length > 0 ? followingList.map((profile) => (
                        <>
                          <ListItem>
                            <Stack
                              direction="row"
                              spacing={2}
                            >
                              <>
                                <Avatar
                                  sx={{ bgcolor: "#00a8ff", textDecoration: "none" }}
                                  component={Link}
                                  to={`/profile/${profile.userName}`}
                                >
                                  {profile.firstName[0]}
                                  {profile.lastName[0]}
                                </Avatar>
                                <div>
                                  <Stack direction="column">
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      {profile.firstName} {profile.lastName}
                                    </Typography>
                                    <Typography>@{profile.userName}</Typography>
                                  </Stack>
                                </div>
                                <div style={{
                                  position: "absolute",
                                  right: "10px",
                                  margin: "0 0 50px 0"
                                }}>
                                  {determineActionButtonFollowingList(profile)}
                                </div>
                              </>
                            </Stack>
                          </ListItem>
                          <Divider />
                        </>
                      )) :
                      <div>No following</div>}
                  </List>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <List component="nav" style={{ maxHeight: 200, overflow: "auto" }}>
                    {followersList && followersList.length > 0 ? followersList.map((profile) => (
                        <>
                          <ListItem>
                            <Stack
                              direction="row"
                              spacing={2}
                            >
                              <>
                                <Avatar
                                  sx={{ bgcolor: "#00a8ff", textDecoration: "none" }}
                                  component={Link}
                                  to={`/profile/${profile.userName}`}
                                >
                                  {profile.firstName[0]}
                                  {profile.lastName[0]}
                                </Avatar>
                                <div>
                                  <Stack direction="column">
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      {profile.firstName} {profile.lastName}
                                    </Typography>
                                    <Typography>@{profile.userName}</Typography>
                                  </Stack>
                                </div>
                                <div style={{
                                  position: "absolute",
                                  right: "10px",
                                  margin: "0 0 50px 0"
                                }}>
                                  {determineActionButtonFollowersList(profile)}
                                </div>
                              </>
                            </Stack>
                          </ListItem>
                          <Divider />
                        </>
                      )) :
                      <div>No followers</div>}
                  </List>
                </TabPanel>
              </Box>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default FriendsModal;