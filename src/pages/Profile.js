import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserClient from "../client/UserClient";
import AddFriendsModal from "../components/modals/AddFriendsModal";
import FriendsModal from "../components/modals/FriendsModal";
import DisplayPlaylistByUser from "../components/playlist/DisplayPlaylistByUser";
import DisplayRatingsByUser from "../components/profile/DisplayRatingsByUser";
import DisplayWishlistByUser from "../components/wishlist/DisplayWishlistByUser";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";
import PrimaryTabs from "../shared/tabs/PrimaryTabs";

const Profile = () => {
  const { userName } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [openFriendsModal, setOpenFriendsModal] = useState(false);
  const [openAddFriendsModal, setOpenAddFriendsModal] = useState(false);
  const [friendsAdded, setFriendsAdded] = useState(0);
  const [friendsTab, setFriendsTab] = useState(0);
  const { currentUser } = useContext(UserContext);
  const [userViewingOwnProfile, setUserViewingOwnProfile] = useState(false);
  const currentUserAndCurrentProfile = currentUser?.userName == userName;
  const queryClient = useQueryClient();

  const { data: profileInfo, isLoading } = useQuery({
    queryKey: ["profileInfo", { userName }],
    queryFn: async () => {
      return await UserClient.getUserInfo(userName);
    },
    staleTime: 60000,
    select: ({ data }) => data.data.user,
  });

  const unFollowProfile = useMutation({
    mutationFn: () => {
      return UserClient.unFollowUser(profileInfo.userName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: userName }],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: currentUser?.userName }],
      });
    },
  });

  const followProfile = useMutation({
    mutationFn: () => {
      return UserClient.followUser(profileInfo.userName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: userName }],
      });
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: currentUser?.userName }],
      });
    },
  });

  useEffect(() => {
    setUserViewingOwnProfile(currentUserAndCurrentProfile);
    setOpenFriendsModal(false);
  }, [userName]);

  const getProfileDetails = async () => {
    // TODO invalide queries of user profile details
  };

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
    } else if (profileInfo?.followers?.includes(currentUser?.userName)) {
      return (
        <PrimaryButton
          variant="outlined"
          onClick={() => unFollowProfile.mutate()}
        >
          Following
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          variant="contained"
          onClick={() => followProfile.mutate()}
        >
          Follow
        </PrimaryButton>
      );
    }
  };

  const tabItems = [
    {
      title: "Ratings",
      value: 0,
      content: <DisplayRatingsByUser profileUserName={profileInfo?.userName} />,
    },
    {
      title: "Wishlist",
      content: (
        <DisplayWishlistByUser
          profileView={true}
          userName={profileInfo?.userName}
        />
      ),
    },
    {
      value: 1,
      title: "Playlist",
      content: (
        <DisplayPlaylistByUser
          userName={profileInfo?.userName}
          profileView={true}
        />
      ),
    },
  ];

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginTop: "25px", marginBottom: "25px" }}
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
                {profileInfo?.firstName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "13px",
                }}
              >
                @{profileInfo?.userName}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ marginRight: "12px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => handleFriendsModalOpen(0)}
              >
                {profileInfo?.following?.length}
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
                {profileInfo?.followers?.length}
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
          displayedProfileUserName={profileInfo.userName}
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
