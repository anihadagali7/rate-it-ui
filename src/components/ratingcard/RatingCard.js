import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import { useContext } from "react";
import { Link } from "react-router-dom";
import CommentClient from "../../client/CommentClient";
import LikeClient from "../../client/LikeClient";
import UserContext from "../../shared/context/userContext";
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

const invalidateRatingQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["feedRatings"] });
  queryClient.invalidateQueries({ queryKey: ["allExploreRatings"] });
  queryClient.invalidateQueries({ queryKey: ["ratingsForUser"] });
  queryClient.invalidateQueries({ queryKey: ["ratingsForMedia"] });
};

const RatingCard = ({ rating, hideMedia = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const reviewText = rating?.comments || "";
  const isLongReview = reviewText.length > MAX_REVIEW_LENGTH;
  const displayReview = isLongReview
    ? `${reviewText.slice(0, MAX_REVIEW_LENGTH)}…`
    : reviewText;

  const mediaType = rating?.media?.mediaType?.toLowerCase();
  const mediaPath = mediaType
    ? `/${mediaType}/${rating.media.mediaId}`
    : "#";

  const { mutateAsync: toggleLike, isLoading: isLikeLoading } = useMutation({
    mutationFn: async (shouldLike) => {
      if (shouldLike) {
        await LikeClient.likeRating(rating._id);
      } else {
        await LikeClient.unlikeRating(rating._id);
      }
    },
    onSuccess: () => invalidateRatingQueries(queryClient),
  });

  const { mutateAsync: addComment, isLoading: isCommentSubmitting } =
    useMutation({
      mutationFn: async (text) => {
        await CommentClient.addComment(rating._id, text);
      },
      onSuccess: () => invalidateRatingQueries(queryClient),
    });

  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: async (commentId) => {
      await CommentClient.deleteComment(commentId);
    },
    onSuccess: () => invalidateRatingQueries(queryClient),
  });

  const { mutateAsync: toggleCommentLike } = useMutation({
    mutationFn: async ({ commentId, shouldLike }) => {
      if (shouldLike) {
        await CommentClient.likeComment(commentId);
      } else {
        await CommentClient.unlikeComment(commentId);
      }
    },
    onSuccess: () => invalidateRatingQueries(queryClient),
  });

  return (
    <SurfaceCard>
      <Stack
        direction={isMobile && !hideMedia ? "column" : "row"}
        spacing={2}
        alignItems={isMobile && !hideMedia ? "stretch" : "flex-start"}
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
            <Box sx={{ minWidth: 0, flex: 1 }}>
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
            {hideMedia ? (
              <ScoreBadge score={rating?.rating} size="sm" />
            ) : null}
          </Stack>

          {!hideMedia ? (
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
          ) : null}

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

          {isMobile && !hideMedia ? (
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

        {!isMobile && !hideMedia ? (
          <MediaPoster
            src={rating?.media?.picture}
            alt={rating?.media?.name}
          />
        ) : null}
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          mt: 2,
          pt: 1.5,
          borderTop: `1px solid ${tokens.colors.border}`,
        }}
      >
        <LikeButton
          initialLiked={!!rating?.likedByCurrentUser}
          initialCount={rating?.likeCount ?? 0}
          disabled={!currentUser}
          isLoading={isLikeLoading}
          onToggle={toggleLike}
        />
        <CommentThread
          comments={rating?.commentList || []}
          commentCount={rating?.commentCount ?? 0}
          currentUser={currentUser}
          isSubmitting={isCommentSubmitting}
          onAdd={addComment}
          onDelete={deleteComment}
          onToggleLike={(commentId, shouldLike) =>
            toggleCommentLike({ commentId, shouldLike })
          }
        />
      </Box>
    </SurfaceCard>
  );
};

export default RatingCard;
