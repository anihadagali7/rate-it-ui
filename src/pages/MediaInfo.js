import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MediaClient from "../client/MediaClient";
import RatingClient from "../client/RatingClient";
import WishlistClient from "../client/WishlistClient";
import AddPlaylistModal from "../components/modals/AddPlaylistModal";
import AddRatingModal from "../components/modals/AddRatingModal";
import DesktopPlaylistDialog from "../components/mediainfo/DesktopPlaylistDialog";
import MediaInfoHero from "../components/mediainfo/MediaInfoHero";
import MediaMetadata from "../components/mediainfo/MediaMetadata";
import MobilePlaylistDrawer from "../components/mediainfo/MobilePlaylistDrawer";
import FeedList from "../components/feed/FeedList";
import Button from "../shared/buttons/Button";
import FeedLayout from "../shared/layout/FeedLayout";
import MediaInfoLoading from "../shared/loading/MediaInfoLoading";
import SurfaceCard from "../shared/primitives/SurfaceCard";
import Toast from "../shared/feedback/Toast";
import LoginErrorModal from "../shared/errorModals/LoginErrorModal";
import QueryErrorState from "../shared/errors/QueryErrorState";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";

const MediaInfo = () => {
  const { id, mediaType } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });
  const [wishlistJustAdded, setWishlistJustAdded] = useState(false);
  const [ratingJustAdded, setRatingJustAdded] = useState(null);

  const {
    isLoading,
    isError,
    refetch,
    data: mediaInfo,
  } = useQuery({
    queryKey: ["mediaInfoDetails", { mediaType, id }],
    queryFn: async () => MediaClient.getMediaInfoDetails(mediaType, id),
    staleTime: 60000,
    select: ({ data }) => data.data.media,
  });

  const {
    data: ratingsList,
    isError: isRatingsError,
    refetch: refetchRatings,
  } = useQuery({
    queryKey: ["ratingsForMedia", { mediaType, id }],
    queryFn: async () => RatingClient.getAllRatingsForMedia(id),
    staleTime: 60000,
    select: ({ data }) => data.data.ratingsList,
  });

  const { data: wishlistList } = useQuery({
    queryKey: ["getAllWishlistForUser", currentUser?.userName],
    queryFn: async () =>
      WishlistClient.getAllWishlistForUser(currentUser.userName),
    staleTime: 60000,
    enabled: !!currentUser?.userName,
    select: ({ data }) => data.data.wishlistList,
  });

  useEffect(() => {
    setWishlistJustAdded(false);
    setRatingJustAdded(null);
  }, [id]);

  const existingUserRating = useMemo(() => {
    if (!currentUser?.userName || !ratingsList?.length) {
      return null;
    }
    const match = ratingsList.find(
      (rating) => rating.ratedBy?.userName === currentUser.userName
    );
    return match ? match.rating : null;
  }, [ratingsList, currentUser?.userName]);

  const hasRated = ratingJustAdded != null || existingUserRating != null;
  const userRating =
    ratingJustAdded != null ? ratingJustAdded : existingUserRating;

  const isOnWishlist = useMemo(() => {
    if (wishlistJustAdded) {
      return true;
    }
    const mediaId = mediaInfo?.mediaId || id;
    if (!mediaId || !wishlistList?.length) {
      return false;
    }
    return wishlistList.some((item) => item.media?.mediaId === mediaId);
  }, [wishlistList, mediaInfo?.mediaId, id, wishlistJustAdded]);

  const { mutate: addToWishlist, isLoading: isWishlistLoading } = useMutation({
    mutationFn: async (requestBody) => {
      await WishlistClient.addToWishlist(requestBody);
    },
    onSuccess: () => {
      setWishlistJustAdded(true);
      queryClient.invalidateQueries({
        queryKey: ["getAllWishlistForUser", currentUser?.userName],
      });
      setToast({
        open: true,
        message: `${mediaInfo?.name || "Title"} saved to your wishlist`,
      });
    },
    onError: () => {
      setToast({
        open: true,
        message: "Couldn't add to wishlist. Try again.",
      });
    },
  });

  const requireAuth = (action) => {
    if (!currentUser) {
      setDisplayTokenModal(true);
      return;
    }
    action();
  };

  const handleAddToWishlist = () => {
    if (isOnWishlist || isWishlistLoading) {
      return;
    }
    requireAuth(() => {
      addToWishlist({ mediaId: mediaInfo.mediaId });
    });
  };

  const handleOpenRating = () => {
    if (hasRated) {
      return;
    }
    requireAuth(() => setOpenRatingModal(true));
  };

  const handleRatingSuccess = ({ rating }) => {
    setRatingJustAdded(rating);
    setToast({
      open: true,
      message: `You rated ${mediaInfo?.name || "this title"} ${rating}/10`,
    });
  };

  const handleRatingError = () => {
    setToast({
      open: true,
      message: "Couldn't submit your rating. Try again.",
    });
  };

  const handlePlaylistSuccess = ({
    playlistsToAdd = [],
    playlistsToRemove = [],
  } = {}) => {
    let message = "Playlists updated";

    if (playlistsToAdd.length > 0 && playlistsToRemove.length === 0) {
      message =
        playlistsToAdd.length === 1
          ? "Added to playlist"
          : `Added to ${playlistsToAdd.length} playlists`;
    } else if (playlistsToRemove.length > 0 && playlistsToAdd.length === 0) {
      message =
        playlistsToRemove.length === 1
          ? "Removed from playlist"
          : `Removed from ${playlistsToRemove.length} playlists`;
    }

    setToast({ open: true, message });
  };

  const handleOpenPlaylist = () => {
    requireAuth(() => setOpenPlaylist(true));
  };

  return (
    <FeedLayout>
      <Button
        variant="ghost"
        leftIcon={<KeyboardBackspaceIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {isLoading ? <MediaInfoLoading /> : null}

      {isError ? (
        <QueryErrorState
          message="Unable to load media details."
          onRetry={refetch}
        />
      ) : null}

      {!isLoading && !isError && mediaInfo ? (
        <>
          <SurfaceCard padding={2.5} sx={{ mb: 2 }}>
            <MediaInfoHero
              mediaInfo={mediaInfo}
              ratingsList={ratingsList || []}
              onRate={handleOpenRating}
              onWishlist={handleAddToWishlist}
              onPlaylist={handleOpenPlaylist}
              isOnWishlist={isOnWishlist}
              isWishlistLoading={isWishlistLoading}
              hasRated={hasRated}
              userRating={userRating}
            />

            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                borderTop: `1px solid ${tokens.colors.border}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: tokens.colors.textPrimary,
                  mb: 1.5,
                }}
              >
                About
              </Typography>
              <MediaMetadata
                mediaType={mediaInfo.mediaType}
                mediaInfo={mediaInfo}
              />
            </Box>
          </SurfaceCard>

          {isRatingsError ? (
            <SurfaceCard padding={2.5} sx={{ mb: 2 }}>
              <QueryErrorState
                message="Unable to load reviews."
                onRetry={refetchRatings}
              />
            </SurfaceCard>
          ) : null}

          {!isRatingsError && ratingsList?.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: tokens.colors.textPrimary,
                  mb: 1.5,
                }}
              >
                Community reviews ({ratingsList.length})
              </Typography>
              <FeedList ratings={ratingsList} />
            </Box>
          ) : null}

          {!isRatingsError && ratingsList?.length === 0 ? (
            <SurfaceCard padding={3}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: tokens.colors.textPrimary,
                  mb: 0.5,
                }}
              >
                No reviews yet
              </Typography>
              <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
                Be the first to rate this title.
              </Typography>
            </SurfaceCard>
          ) : null}
        </>
      ) : null}

      {openRatingModal && mediaInfo ? (
        <AddRatingModal
          open={openRatingModal}
          onClose={() => setOpenRatingModal(false)}
          mediaDetails={mediaInfo}
          onSuccess={handleRatingSuccess}
          onError={handleRatingError}
        />
      ) : null}

      {openNewPlaylistModal ? (
        <AddPlaylistModal
          open={openNewPlaylistModal}
          onClose={() => setNewPlaylistModal(false)}
          profileUserName={currentUser?.userName}
        />
      ) : null}

      {displayTokenModal ? (
        <LoginErrorModal
          open={displayTokenModal}
          onClose={() => setDisplayTokenModal(false)}
        />
      ) : null}

      {isMobile ? (
        <MobilePlaylistDrawer
          open={openPlaylist}
          onClose={() => setOpenPlaylist(false)}
          handleNewPlaylistModalOpen={() => setNewPlaylistModal(true)}
          mediaId={mediaInfo?._id}
          onSuccess={handlePlaylistSuccess}
        />
      ) : (
        <DesktopPlaylistDialog
          open={openPlaylist}
          onClose={() => setOpenPlaylist(false)}
          handleNewPlaylistModalOpen={() => setNewPlaylistModal(true)}
          mediaId={mediaInfo?._id}
          onSuccess={handlePlaylistSuccess}
        />
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: "" })}
      />
    </FeedLayout>
  );
};

export default MediaInfo;
