import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { theme } from "../Theme/Theme";
import { Provider, useAtom } from "jotai";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useParams } from "react-router-dom";
import UserClient from "../client/UserClient";
import FriendsModal from "../components/modals/FriendsModal";
import { currentUser } from "../state/user";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import AddFriendsModal from "../components/modals/AddFriendsModal";
import DisplayRatingsByUser from "../components/profile/DisplayRatingsByUser";
import DisplayWishlistByUser from "../components/profile/DisplayWishlistByUser";
import DisplayPlaylistByUser from "../components/profile/DisplayPlaylistByUser";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
};

const Profile = () => {
  const { userName } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [openFriendsModal, setOpenFriendsModal] = useState(false);
  const [openAddFriendsModal, setOpenAddFriendsModal] = useState(false);
  const [friendsAdded, setFriendsAdded] = useState(0);
  const [friendsTab, setFriendsTab] = useState(0);
  const [user, setUser] = useAtom(currentUser);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const followProfile = async () => {
    await UserClient.followUser(user.userName, currentProfile.userName);
  };

  const unFollowProfile = async () => {
    await UserClient.unFollowUser(user.userName, currentProfile.userName);
  };

  const getProfileDetails = async () => {
    // TODO only make this call once if user and userName are the same
    const currentUser = await UserClient.getUserInfo(user.userName);
    setUser(currentUser.data.user);
    const result = await UserClient.getUserInfo(userName);
    setCurrentProfile(result.data.user);
    setOpenFriendsModal(false);
  };

  useEffect(() => {
    getProfileDetails();
  }, [userName]);

  const handleFriendsModalClose = () => {
    getProfileDetails();
    setOpenFriendsModal(false);
  };

  const handleFriendsModalOpen = (initialTab) => {
    setFriendsTab(initialTab);
    setOpenFriendsModal(true);
  };

  const handleAddFriendsModalClose = () => {
    setOpenAddFriendsModal(false);
    if (friendsAdded > 0){
      getProfileDetails();
    }
    setFriendsAdded(0);
  };

  const handleAddFriendsModalOpen = () => {
    setOpenAddFriendsModal(true);
  };

  const determineActionButton = () => {
    if (user.userName === userName) {
      return (
        <Button
          variant="outlined"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%"
          }}
          component={Link}
          to={"/profile/edit"}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#00a8ff",
                        fontWeight: "bold"
                      }}
          >
            Edit profile
          </Typography>
        </Button>
      );
    } else if (currentProfile && currentProfile.followers && currentProfile.followers.includes(user && user.userName)) {
      return (
        <Button
          variant="outlined"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%"
          }}
          onClick={unFollowProfile}
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
          onClick={followProfile}
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

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container maxWidth={"sm"} sx={{ marginTop: "50px", marginBottom: "25px" }}>
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
                  minHeight: "300px",
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  borderRadius: "17px"
                }}
              >
                <Grid container>
                  <Grid item xs={7} sx={{ marginLeft: "5px" }}>
                    <Avatar
                      src={AccountCircleIcon}
                      sx={{
                        width: 56,
                        height: 56,
                        marginLeft: "13px",
                        marginTop: "10px"
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    {determineActionButton()}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        marginLeft: "22px",
                        marginTop: "10px",
                        fontWeight: "bold"
                      }}
                    >
                      {currentProfile?.firstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        marginLeft: "22px",
                        marginTop: "0px",
                        fontSize: "13px"
                      }}
                    >
                      @{currentProfile?.userName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <span
                      style={{
                        marginLeft: "22px",
                        marginTop: "0px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                      onClick={() => handleFriendsModalOpen(0)}
                    >
                      {currentProfile && currentProfile.following && currentProfile.following.length}
                      <span style={{ fontWeight: "normal" }}> following</span>
                    </span>
                    <span
                      style={{
                        marginLeft: "22px",
                        marginTop: "0px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                      onClick={() => handleFriendsModalOpen(1)}
                    >
                      {currentProfile && currentProfile.followers && currentProfile.followers.length}
                      <span style={{ fontWeight: "normal" }}> followers</span>
                    </span>
                  </Grid>
                  {user.userName === userName && (
                    <Grid item xs={12}>
                      <Button variant="text" endIcon={<PersonAddAltSharpIcon />}
                              sx={{ color: "#00a8ff", marginLeft: "15px" }}
                              onClick={handleAddFriendsModalOpen}>
                        Add friends
                      </Button>

                    </Grid>
                  )}

                </Grid>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
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
                        label="Ratings"
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
                        label="Wishlist"
                      />
                      {/*<Tab*/}
                      {/*  sx={{*/}
                      {/*    fontSize: "13px",*/}
                      {/*    "&.Mui-selected": {*/}
                      {/*      color: "#40a9ff",*/}
                      {/*      fontSize: "13px"*/}
                      {/*    },*/}
                      {/*    "&.Mui-focusVisible": {*/}
                      {/*      backgroundColor: "#40a9ff"*/}
                      {/*    }*/}
                      {/*  }}*/}
                      {/*  label="Likes"*/}
                      {/*/>*/}
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
                        label="Playlists"
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0}>
                    <DisplayRatingsByUser user={currentProfile} />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <DisplayWishlistByUser user={currentProfile} />
                  </TabPanel>
                  {/*<TabPanel value={tabValue} index={2}>*/}
                  {/*  Likes*/}
                  {/*</TabPanel>*/}
                  <TabPanel value={tabValue} index={2}>
                    <DisplayPlaylistByUser user={currentProfile} />
                  </TabPanel>
                </Box>
              </Paper>
            </Box>
          </Container>
          {openFriendsModal && (
            <FriendsModal open={openFriendsModal} onClose={handleFriendsModalClose} userName={currentProfile.userName}
                          currentUser={user} openingTab={friendsTab} />
          )}
          {openAddFriendsModal && (
            <AddFriendsModal open={openAddFriendsModal} onClose={handleAddFriendsModalClose} currentUser={user}
                          friendsAdded={friendsAdded} setFriendsAdded={setFriendsAdded}/>
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Profile;
