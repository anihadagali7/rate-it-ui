import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";
import MediaTypeBadge from "../../shared/media/MediaTypeBadge";
import MediaPoster from "../../shared/primitives/MediaPoster";
import ScoreBadge from "../../shared/primitives/ScoreBadge";
import { tokens } from "../../styles/tokens";
import MediaActionBar from "./MediaActionBar";

const getAverageRating = (ratings = []) => {
  if (!ratings.length) {
    return null;
  }

  const total = ratings.reduce(
    (sum, rating) => sum + parseFloat(rating.rating || 0),
    0
  );

  return (total / ratings.length).toFixed(1);
};

const MediaInfoHero = ({
  mediaInfo,
  ratingsList = [],
  onRate,
  onWishlist,
  onPlaylist,
  isOnWishlist = false,
  isWishlistLoading = false,
  hasRated = false,
  userRating = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mediaType = mediaInfo.mediaType?.toLowerCase();
  const averageRating = getAverageRating(ratingsList);
  const releaseYear = mediaInfo.dateReleased
    ? moment(mediaInfo.dateReleased).format("YYYY")
    : null;

  return (
    <Box>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2.5}
        alignItems={isMobile ? "stretch" : "flex-start"}
      >
        <Box sx={{ flexShrink: 0, mx: isMobile ? "auto" : 0 }}>
          <MediaPoster
            src={mediaInfo.picture}
            alt={mediaInfo.name}
            width={isMobile ? 180 : 160}
            height={isMobile ? 260 : 240}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: isMobile ? 24 : 28,
              fontWeight: 700,
              color: tokens.colors.textPrimary,
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            {mediaInfo.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <MediaTypeBadge type={mediaType} />
            {releaseYear ? (
              <Typography
                sx={{ fontSize: 14, color: tokens.colors.textSecondary }}
              >
                {releaseYear}
              </Typography>
            ) : null}
          </Box>

          {averageRating ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <ScoreBadge score={averageRating} />
              <Typography sx={{ fontSize: 13, color: tokens.colors.textSecondary }}>
                avg from {ratingsList.length}{" "}
                {ratingsList.length === 1 ? "review" : "reviews"}
              </Typography>
            </Box>
          ) : null}

          {!isMobile ? (
            <MediaActionBar
              onRate={onRate}
              onWishlist={onWishlist}
              onPlaylist={onPlaylist}
              isOnWishlist={isOnWishlist}
              isWishlistLoading={isWishlistLoading}
              hasRated={hasRated}
              userRating={userRating}
            />
          ) : null}
        </Box>
      </Stack>

      {isMobile ? (
        <Box sx={{ mt: 2 }}>
          <MediaActionBar
            onRate={onRate}
            onWishlist={onWishlist}
            onPlaylist={onPlaylist}
            isOnWishlist={isOnWishlist}
            isWishlistLoading={isWishlistLoading}
            hasRated={hasRated}
            userRating={userRating}
            isMobile
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default MediaInfoHero;
