import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useParams } from "react-router-dom";
import UserClient from "../client/UserClient";
import FriendsModal from "../components/modals/FriendsModal";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import AddFriendsModal from "../components/modals/AddFriendsModal";
import DisplayRatingsByUser from "../components/profile/DisplayRatingsByUser";
import DisplayWishlistByUser from "../components/profile/DisplayWishlistByUser";
import DisplayPlaylistByUser from "../components/profile/DisplayPlaylistByUser";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import PrimaryTabs from "../shared/tabs/PrimaryTabs";
import UserContext from "../shared/context/userContext";

const Profile = () => {
  const { userName } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [openFriendsModal, setOpenFriendsModal] = useState(false);
  const [openAddFriendsModal, setOpenAddFriendsModal] = useState(false);
  const [friendsAdded, setFriendsAdded] = useState(0);
  const [friendsTab, setFriendsTab] = useState(0);
  const { currentUser } = useContext(UserContext);
  const [userViewingOwnProfile, setUserViewingOwnProfile] = useState(false);

  const followProfile = async () => {
    await UserClient.followUser(currentUser.userName, profile.userName);
    getProfileDetails();
  };

  const unFollowProfile = async () => {
    await UserClient.unFollowUser(currentUser.userName, profile.userName);
    getProfileDetails();
  };

  const getProfileDetails = async () => {
    const userAndProfile = currentUser.userName === userName;

    if (!userAndProfile) {
      const result = await UserClient.getUserInfo(userName);
      setProfile(result.data.user);
    } else {
      setProfile(currentUser);
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
      profile.followers.includes(currentUser && currentUser.userName)
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

  const tabItems = [
    {
      title: "Ratings",
      value: 0,
      content: <DisplayRatingsByUser user={profile} />,
    },
    {
      value: 1,
      title: "Wishlist",
      content: <DisplayWishlistByUser user={profile} />,
    },
    {
      value: 2,
      title: "Playlist",
      content: (
        <DisplayPlaylistByUser
          user={profile}
          userViewingOwnProfile={userViewingOwnProfile}
        />
      ),
    },
  ];

  return (
    <Box>
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
            {currentUser.userName === userName && (
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
          <Box sx={{ padding: "0 35px" }}>
            <PrimaryTabs
              tabItems={tabItems}
              navigation
              user={profile}
              handleChange={setTabValue}
              activeTab={tabValue}
              onTabChange={setTabValue}
            />
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
          openingTab={friendsTab}
        />
      )}
      {openAddFriendsModal && (
        <AddFriendsModal
          open={openAddFriendsModal}
          onClose={handleAddFriendsModalClose}
          friendsAdded={friendsAdded}
          setFriendsAdded={setFriendsAdded}
        />
      )}
    </Box>
  );
};

export default Profile;
