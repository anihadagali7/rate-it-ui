import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthClient from "../client/AuthClient";
import UserClient from "../client/UserClient";
import RatingClient from "../client/RatingClient";
import AddFriendsModal from "../components/modals/AddFriendsModal";
import FriendsModal from "../components/modals/FriendsModal";
import DisplayPlaylistByUser from "../components/playlist/DisplayPlaylistByUser";
import DisplayRatingsByUser from "../components/profile/DisplayRatingsByUser";
import ProfileHeader from "../components/profile/ProfileHeader";
import DisplayWishlistByUser from "../components/wishlist/DisplayWishlistByUser";
import FeedLayout from "../shared/layout/FeedLayout";
import ProfileLoading from "../shared/loading/ProfileLoading";
import TabBar from "../shared/navigation/TabBar";
import UserContext from "../shared/context/userContext";
import QueryErrorState from "../shared/errors/QueryErrorState";

const PROFILE_TABS = {
  REVIEWS: "reviews",
  WISHLIST: "wishlist",
  PLAYLISTS: "playlists",
};

const ALLOWED_PICTURE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PICTURE_SIZE_BYTES = 5 * 1024 * 1024;

const Profile = () => {
  const { userName } = useParams();
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.REVIEWS);
  const [openFriendsModal, setOpenFriendsModal] = useState(false);
  const [openAddFriendsModal, setOpenAddFriendsModal] = useState(false);
  const [friendsAdded, setFriendsAdded] = useState(0);
  const [friendsTab, setFriendsTab] = useState(0);
  const [pictureError, setPictureError] = useState("");
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?.userName === userName;

  const { data: profileInfo, isLoading, isError, refetch } = useQuery({
    queryKey: ["profileInfo", { userName }],
    queryFn: async () => UserClient.getUserInfo(userName),
    staleTime: 60000,
    select: ({ data }) => data.data.user,
  });

  const { data: reviewCount } = useQuery({
    queryKey: ["ratingsForUser", { profileUserName: userName }],
    queryFn: async () => RatingClient.getAllRatingsForUser(userName),
    staleTime: 60000,
    enabled: !!userName,
    select: ({ data }) => data.data.ratingsList.length,
  });

  const unFollowProfile = useMutation({
    mutationFn: () => UserClient.unFollowUser(profileInfo.userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileInfo", { userName }] });
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: currentUser?.userName }],
      });
      queryClient.invalidateQueries({ queryKey: ["allExploreRatings"] });
      queryClient.invalidateQueries({ queryKey: ["feedRatings"] });
    },
  });

  const followProfile = useMutation({
    mutationFn: () => UserClient.followUser(profileInfo.userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileInfo", { userName }] });
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: currentUser?.userName }],
      });
      queryClient.invalidateQueries({ queryKey: ["allExploreRatings"] });
      queryClient.invalidateQueries({ queryKey: ["feedRatings"] });
    },
  });

  const uploadPicture = useMutation({
    mutationFn: (file) => AuthClient.uploadProfilePicture(file),
    onSuccess: ({ data }) => {
      const updatedUser = data.data.user;
      setCurrentUser((previousUser) => ({
        ...previousUser,
        picture: updatedUser.picture,
      }));
      queryClient.invalidateQueries({ queryKey: ["profileInfo", { userName }] });
    },
    onError: (error) => {
      setPictureError(
        error?.response?.data?.errors?.msg ||
          "Couldn't upload your picture. Please try again."
      );
    },
  });

  const handlePictureSelected = (file) => {
    if (!ALLOWED_PICTURE_TYPES.includes(file.type)) {
      setPictureError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_PICTURE_SIZE_BYTES) {
      setPictureError("Please choose an image under 5MB.");
      return;
    }
    setPictureError("");
    uploadPicture.mutate(file);
  };

  useEffect(() => {
    setOpenFriendsModal(false);
    setActiveTab(PROFILE_TABS.REVIEWS);
  }, [userName]);

  const handleFriendsModalClose = () => {
    setOpenFriendsModal(false);
    setFriendsAdded(0);
  };

  const handleFriendsModalOpen = (initialTab) => {
    setFriendsTab(initialTab);
    setOpenFriendsModal(true);
  };

  const handleAddFriendsModalClose = () => {
    setOpenAddFriendsModal(false);
    setFriendsAdded(0);
  };

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (isError) {
    return (
      <FeedLayout>
        <QueryErrorState
          message="Unable to load this profile."
          onRetry={refetch}
        />
      </FeedLayout>
    );
  }

  const isFollowing = profileInfo?.followers?.includes(currentUser?.userName);

  const renderTabContent = () => {
    switch (activeTab) {
      case PROFILE_TABS.WISHLIST:
        return <DisplayWishlistByUser userName={profileInfo?.userName} />;
      case PROFILE_TABS.PLAYLISTS:
        return <DisplayPlaylistByUser userName={profileInfo?.userName} />;
      case PROFILE_TABS.REVIEWS:
      default:
        return <DisplayRatingsByUser profileUserName={profileInfo?.userName} />;
    }
  };

  return (
    <FeedLayout>
      <ProfileHeader
        profile={profileInfo}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        reviewCount={reviewCount}
        onFollow={() => followProfile.mutate()}
        onUnfollow={() => unFollowProfile.mutate()}
        onFollowingClick={() => handleFriendsModalOpen(0)}
        onFollowersClick={() => handleFriendsModalOpen(1)}
        onAddFriends={() => setOpenAddFriendsModal(true)}
        onPictureSelected={handlePictureSelected}
        isUploadingPicture={uploadPicture.isLoading}
        pictureError={pictureError}
      />

      <TabBar
        tabs={[
          { id: PROFILE_TABS.REVIEWS, label: "Reviews" },
          { id: PROFILE_TABS.WISHLIST, label: "Wishlist" },
          { id: PROFILE_TABS.PLAYLISTS, label: "Playlists" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {renderTabContent()}

      {openFriendsModal ? (
        <FriendsModal
          open={openFriendsModal}
          onClose={handleFriendsModalClose}
          displayedProfileUserName={profileInfo.userName}
          openingTab={friendsTab}
        />
      ) : null}

      {openAddFriendsModal ? (
        <AddFriendsModal
          open={openAddFriendsModal}
          onClose={handleAddFriendsModalClose}
          friendsAdded={friendsAdded}
          setFriendsAdded={setFriendsAdded}
        />
      ) : null}
    </FeedLayout>
  );
};

export default Profile;
