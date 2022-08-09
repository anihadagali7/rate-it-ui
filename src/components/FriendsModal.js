import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, StyledEngineProvider,
  ThemeProvider, Typography
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import UserClient from "../client/UserClient";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box >{children}</Box>}</div>;
};

const FriendsModal = ({ open, onClose, userName, openingTab, currentUser }) => {
  const [tabValue, setTabValue] = useState(openingTab);
  const [followingList, setFollowingList] = useState({});
  const [followersList, setFollowersList] = useState({});
  const [updateList, setUpdateList] = useState(false);

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
  }, [userName, updateList]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const displayFollowingButton = (profile) => {
    // check if current user follows this profile
    // if yes, show "following" text
    // if not, show "follow" text

    // console.log("-> currentUser.following", currentUser.following);
    // console.log("-> profile", profile);
    let currentlyFollows = currentUser.following.includes(profile);
    let text = currentlyFollows ? "Following" : "Follow";
    let buttonType = currentlyFollows ? "outlined" : "contained"
    return (
      <Button
        variant={buttonType}
        sx={{
          borderRadius: "17px",
          width: "100%",
          height: '30px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        // onClick={currentlyFollows ? unFollowUser(currentUser.userName, profile) : followUser(currentUser.userName, profile)}
        onClick={() => {
          currentlyFollows ? unFollowUser(currentUser.userName, profile) : followUser(currentUser.userName, profile)
        }}
      >
        <Typography component="div"
                    sx={{
                      fontSize: "12px",
                      color: "#00a8ff",
                      fontWeight: "bold",
                    }}
        >
          {text}
        </Typography>
      </Button>
    )
  }

  const unFollowUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.unFollowUser(currentUser, userToUnfollow);
    result == 200 && setUpdateList(!updateList);
  }

  const followUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.followUser(currentUser, userToUnfollow);
    result == 200 && setUpdateList(!updateList);
  }

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose} maxWidth="xs"
                    sx={{ "&.MuiPaper-root": { width: "100%", height: 400, maxWidth: 300, overflowY: "hidden" } }}>
              <DialogTitle
                sx={{ fontSize: "13px", fontWeight: "bold", margin: "auto", height: "0px" }}>{userName}</DialogTitle>
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
                  <List component="nav">
                    {followingList && followingList.length > 0 ? followingList.map((profile) => (
                        <>
                          <ListItem >
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
                                    <Typography>
                                      {profile.firstName} {profile.lastName}
                                    </Typography>
                                    <Typography>@{profile.userName}</Typography>
                                  </Stack>
                                </div>
                                {displayFollowingButton(profile.userName)}
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
                  <List component="nav">
                    {followersList && followersList.length > 0 ? followersList.map((profile) => (
                        <>
                          <ListItem >
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
                                    <Typography>
                                      {profile.firstName} {profile.lastName}
                                    </Typography>
                                    <Typography>@{profile.userName}</Typography>
                                  </Stack>
                                </div>
                                <Button
                                  variant="outlined"
                                  sx={{
                                    borderRadius: "17px",
                                    width: "100%",
                                    height: '30px',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Typography component="div"
                                              sx={{
                                                fontSize: "12px",
                                                color: "#00a8ff",
                                                fontWeight: "bold",
                                              }}
                                  >
                                    Following
                                  </Typography>
                                </Button>
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