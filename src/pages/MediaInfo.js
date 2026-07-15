import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
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

  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);

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

  const { mutate: addToWishlist } = useMutation({
    mutationFn: async (requestBody) => {
      await WishlistClient.addToWishlist(requestBody);
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
    requireAuth(() => {
      addToWishlist({ mediaId: mediaInfo.mediaId });
    });
  };

  const handleOpenRating = () => {
    requireAuth(() => setOpenRatingModal(true));
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
        />
      ) : (
        <DesktopPlaylistDialog
          open={openPlaylist}
          onClose={() => setOpenPlaylist(false)}
          handleNewPlaylistModalOpen={() => setNewPlaylistModal(true)}
          mediaId={mediaInfo?._id}
        />
      )}
    </FeedLayout>
  );
};

export default MediaInfo;
