import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  StyledEngineProvider,
  ThemeProvider,
  Typography,
} from "@mui/material";
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
import PrimaryButton from "../shared/buttons/PrimaryButton";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
};

const Profile = () => {
  const { userName } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [openFriendsModal, setOpenFriendsModal] = useState(false);
  const [openAddFriendsModal, setOpenAddFriendsModal] = useState(false);
  const [friendsAdded, setFriendsAdded] = useState(0);
  const [friendsTab, setFriendsTab] = useState(0);
  const [user, setUser] = useAtom(currentUser);
  const [userViewingOwnProfile, setUserViewingOwnProfile] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const followProfile = async () => {
    await UserClient.followUser(user.userName, profile.userName);
    getProfileDetails();
  };

  const unFollowProfile = async () => {
    await UserClient.unFollowUser(user.userName, profile.userName);
    getProfileDetails();
  };

  const getProfileDetails = async () => {
    const userAndProfile = user.userName === userName;
    const currentUser = await UserClient.getUserInfo(user.userName);
    setUser(currentUser.data.user);
    if (!userAndProfile) {
      const result = await UserClient.getUserInfo(userName);
      setProfile(result.data.user);
    } else {
      setProfile(currentUser.data.user);
    }
    setUserViewingOwnProfile(userAndProfile);
    setOpenFriendsModal(false);
  };

  useEffect(() => {
    getProfileDetails();
  }, [userName]);

  const handleFriendsModalClose = () => {
    setOpenFriendsModal(false);
    if (friendsAdded > 0) {
      getProfileDetails();
    }
    setFriendsAdded(0);
  };

  const handleFriendsModalOpen = (initialTab) => {
    setFriendsTab(initialTab);
    setOpenFriendsModal(true);
  };

  const handleAddFriendsModalClose = () => {
    setOpenAddFriendsModal(false);
    if (friendsAdded > 0) {
      getProfileDetails();
    }
    setFriendsAdded(0);
  };

  const handleAddFriendsModalOpen = () => {
    setOpenAddFriendsModal(true);
  };

  const determineActionButton = () => {
    if (userViewingOwnProfile) {
      return (
        <PrimaryButton
          variant="contained"
          buttonElement={Link}
          link={"/profile/edit"}
        >
          Edit profile
        </PrimaryButton>
      );
    } else if (
      profile &&
      profile.followers &&
      profile.followers.includes(user && user.userName)
    ) {
      return (
        <PrimaryButton variant="outlined" onClick={unFollowProfile}>
          Following
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton variant="contained" onClick={followProfile}>
          Follow
        </PrimaryButton>
      );
    }
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container
            maxWidth={"sm"}
            sx={{ marginTop: "50px", marginBottom: "25px" }}
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
              }}
            >
              <Grid container sx={{ padding: "15px 35px" }}>
                <Grid item xs={3}>
                  <Avatar
                    src={AccountCircleIcon}
                    sx={{
                      width: 56,
                      height: 56,
                      marginTop: "10px",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={9}
                  container
                  justifyContent="end"
                  alignContent="center"
                >
                  {determineActionButton()}
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {profile?.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                    }}
                  >
                    @{profile?.userName}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => handleFriendsModalOpen(0)}
                  >
                    {profile && profile.following && profile.following.length}
                    <span style={{ fontWeight: "normal" }}> following</span>
                  </span>
                </Grid>
                <Grid item xs={2}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => handleFriendsModalOpen(1)}
                  >
                    {profile && profile.followers && profile.followers.length}
                    <span style={{ fontWeight: "normal" }}> followers</span>
                  </span>
                </Grid>
                {user.userName === userName && (
                  <Grid item xs={12}>
                    <PrimaryButton
                      variant="text"
                      rightIcon={<PersonAddAltSharpIcon />}
                      onClick={handleAddFriendsModalOpen}
                    >
                      Add friends
                    </PrimaryButton>
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
                          fontSize: "13px",
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff",
                        },
                      }}
                      label="Ratings"
                    />
                    <Tab
                      sx={{
                        fontSize: "13px",
                        "&.Mui-selected": {
                          color: "#40a9ff",
                          fontSize: "13px",
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff",
                        },
                      }}
                      label="Wishlist"
                    />
                    <Tab
                      sx={{
                        fontSize: "13px",
                        "&.Mui-selected": {
                          color: "#40a9ff",
                          fontSize: "13px",
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff",
                        },
                      }}
                      label="Playlists"
                    />
                  </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                  <DisplayRatingsByUser user={profile} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <DisplayWishlistByUser user={profile} />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <DisplayPlaylistByUser
                    user={profile}
                    userViewingOwnProfile={userViewingOwnProfile}
                  />
                </TabPanel>
              </Box>
            </Paper>
          </Container>
          {openFriendsModal && (
            <FriendsModal
              open={openFriendsModal}
              onClose={handleFriendsModalClose}
              userName={profile.userName}
              friendsAdded={friendsAdded}
              setFriendsAdded={setFriendsAdded}
              currentUser={user}
              openingTab={friendsTab}
            />
          )}
          {openAddFriendsModal && (
            <AddFriendsModal
              open={openAddFriendsModal}
              onClose={handleAddFriendsModalClose}
              currentUser={user}
              friendsAdded={friendsAdded}
              setFriendsAdded={setFriendsAdded}
            />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Profile;
