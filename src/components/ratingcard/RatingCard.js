import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import MediaPoster from "../../shared/primitives/MediaPoster";
import ScoreBadge from "../../shared/primitives/ScoreBadge";
import SurfaceCard from "../../shared/primitives/SurfaceCard";
import UserAvatar from "../../shared/primitives/UserAvatar";
import CommentThread from "../../shared/social/CommentThread";
import LikeButton from "../../shared/social/LikeButton";
import { tokens } from "../../styles/tokens";

const MAX_REVIEW_LENGTH = 280;

const getTimeAgo = (date) => {
  const timeAgo = moment(date).fromNow(true);
  const units = timeAgo.split(" ")[1];
  if (
    units?.includes("second") ||
    units?.includes("minute") ||
    units?.includes("hour") ||
    units?.includes("day")
  ) {
    return `${timeAgo.split(" ")[0]}${units[0]}`;
  }
  return moment(date).format("MMM D, YYYY");
};

const RatingCard = ({ rating }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const reviewText = rating?.comments || "";
  const isLongReview = reviewText.length > MAX_REVIEW_LENGTH;
  const displayReview = isLongReview
    ? `${reviewText.slice(0, MAX_REVIEW_LENGTH)}…`
    : reviewText;

  const mediaType = rating?.media?.mediaType?.toLowerCase();
  const mediaPath = mediaType
    ? `/${mediaType}/${rating.media.mediaId}`
    : "#";

  return (
    <SurfaceCard>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        alignItems={isMobile ? "stretch" : "flex-start"}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
            <UserAvatar
              src={rating?.ratedBy?.picture}
              firstName={rating?.ratedBy?.firstName}
              lastName={rating?.ratedBy?.lastName}
              userName={rating?.ratedBy?.userName}
              size="md"
              href={`/profile/${rating?.ratedBy?.userName}`}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component={Link}
                to={`/profile/${rating?.ratedBy?.userName}`}
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: tokens.colors.textPrimary,
                  textDecoration: "none",
                  display: "block",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {rating?.ratedBy?.firstName} {rating?.ratedBy?.lastName}
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 400,
                    color: tokens.colors.textSecondary,
                    ml: 0.5,
                  }}
                >
                  @{rating?.ratedBy?.userName}
                </Typography>
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: tokens.colors.textMuted }}
              >
                {getTimeAgo(rating?.dateCreated)}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            mb={1}
          >
            <Typography
              component={Link}
              to={mediaPath}
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: tokens.colors.textPrimary,
                textDecoration: "none",
                "&:hover": { color: tokens.colors.accent },
              }}
            >
              {rating?.media?.name}
            </Typography>
            <ScoreBadge score={rating?.rating} />
          </Stack>

          {reviewText ? (
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.6,
                color: tokens.colors.textPrimary,
                mb: isMobile ? 1.5 : 0,
              }}
            >
              {displayReview}
              {isLongReview ? (
                <Typography
                  component="span"
                  sx={{
                    color: tokens.colors.accent,
                    fontWeight: 500,
                    ml: 0.5,
                    cursor: "pointer",
                  }}
                >
                  Read more
                </Typography>
              ) : null}
            </Typography>
          ) : null}

          {isMobile ? (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <MediaPoster
                src={rating?.media?.picture}
                alt={rating?.media?.name}
                width={112}
                height={168}
              />
            </Box>
          ) : null}
        </Box>

        {!isMobile ? (
          <MediaPoster
            src={rating?.media?.picture}
            alt={rating?.media?.name}
          />
        ) : null}
      </Stack>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 2,
          pt: 1.5,
          borderTop: `1px solid ${tokens.colors.border}`,
        }}
      >
        <LikeButton disabled />
        <CommentThread commentCount={0} disabled />
      </Box>
    </SurfaceCard>
  );
};

export default RatingCard;
