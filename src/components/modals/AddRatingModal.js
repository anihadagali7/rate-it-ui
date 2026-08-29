import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import RatingClient from "../../client/RatingClient";
import Button from "../../shared/buttons/Button";
import MediaPoster from "../../shared/primitives/MediaPoster";
import MediaTypeBadge from "../../shared/media/MediaTypeBadge";
import { tokens } from "../../styles/tokens";

const SCORE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const MAX_CHARS = 280;

const AddRatingModal = ({ open, onClose, mediaDetails, onSuccess, onError }) => {
  const [payload, setPayload] = useState({
    comments: "",
    rating: null,
  });
  const queryClient = useQueryClient();

  const submitRating = useMutation({
    mutationFn: (requestBody) => RatingClient.submitRating(requestBody),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratingsForMedia"],
      });
      onClose();
      onSuccess?.({ rating: payload.rating });
    },
    onError: () => {
      onError?.();
    },
  });

  const handleSubmitRating = () => {
    submitRating.mutate({
      mediaId: mediaDetails.mediaId,
      comments: payload.comments.trim(),
      rating: payload.rating,
    });
  };

  const missingRating = !payload.rating;
  const missingComment = !payload.comments.trim();
  const isDisabled = missingRating || missingComment || submitRating.isLoading;

  const helperMessage = submitRating.isLoading
    ? null
    : missingRating && missingComment
    ? "Pick a score and share a quick take to submit."
    : missingRating
    ? "Select a score to continue."
    : missingComment
    ? "Add a quick take to submit."
    : null;

  const mediaType = mediaDetails?.mediaType?.toLowerCase();
  const charCount = payload.comments.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 440,
          borderRadius: `${tokens.radius.card}px`,
          border: `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.surface,
          boxShadow: tokens.shadows.lift,
          overflow: "hidden",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(20, 24, 31, 0.45)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box sx={{ position: "relative", p: { xs: 2.5, sm: 3 } }}>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: tokens.colors.textMuted,
            "&:hover": {
              color: tokens.colors.textPrimary,
              backgroundColor: tokens.colors.surfaceHover,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            pr: 4,
            mb: 3,
          }}
        >
          <MediaPoster
            src={mediaDetails?.picture}
            alt={mediaDetails?.name}
            width={72}
            height={108}
          />
          <Box sx={{ minWidth: 0, pt: 0.5 }}>
            <Typography
              sx={{
                fontFamily: tokens.fonts.body,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: tokens.colors.textMuted,
                mb: 0.75,
              }}
            >
              Rate this
            </Typography>
            <Typography
              sx={{
                fontFamily: tokens.fonts.display,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: tokens.colors.textPrimary,
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {mediaDetails?.name}
            </Typography>
            {mediaType ? <MediaTypeBadge type={mediaType} /> : null}
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2.5 }}>
          <Typography
            sx={{
              fontFamily: tokens.fonts.display,
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: payload.rating
                ? tokens.colors.signal
                : tokens.colors.textMuted,
              mb: 0.5,
            }}
          >
            {payload.rating ?? "–"}
            <Box
              component="span"
              sx={{
                fontSize: 22,
                fontWeight: 600,
                color: tokens.colors.textMuted,
                ml: 0.5,
              }}
            >
              /10
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: tokens.colors.textSecondary,
              mb: 2,
            }}
          >
            Tap a score to rate
          </Typography>

          <Box
            role="radiogroup"
            aria-label="Rating score"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(5, 1fr)",
                sm: "repeat(10, 1fr)",
              },
              gap: 0.75,
            }}
          >
            {SCORE_OPTIONS.map((score) => {
              const selected = payload.rating === score;
              return (
                <Box
                  key={score}
                  component="button"
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`Rate ${score} out of 10`}
                  onClick={() =>
                    setPayload((prev) => ({ ...prev, rating: score }))
                  }
                  sx={{
                    border: `1.5px solid ${
                      selected
                        ? tokens.colors.signal
                        : tokens.colors.borderStrong
                    }`,
                    backgroundColor: selected
                      ? tokens.colors.signal
                      : "transparent",
                    color: selected ? "#FFFFFF" : tokens.colors.textSecondary,
                    borderRadius: `${tokens.radius.button}px`,
                    height: { xs: 44, sm: 36 },
                    cursor: "pointer",
                    fontFamily: tokens.fonts.display,
                    fontSize: 13,
                    fontWeight: 700,
                    transition: `all ${tokens.motion.quick}`,
                    "&:hover": {
                      borderColor: tokens.colors.signal,
                      color: selected ? "#FFFFFF" : tokens.colors.signal,
                      backgroundColor: selected
                        ? tokens.colors.signal
                        : tokens.colors.signalSoft,
                    },
                  }}
                >
                  {score}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            htmlFor="rating-comments"
            sx={{
              display: "block",
              fontSize: 13,
              fontWeight: 650,
              color: tokens.colors.textPrimary,
              mb: 1,
            }}
          >
            Your take
            <Box
              component="span"
              sx={{ color: tokens.colors.danger, ml: 0.25 }}
            >
              *
            </Box>
          </Typography>
          <Box
            component="textarea"
            id="rating-comments"
            name="comments"
            value={payload.comments}
            maxLength={MAX_CHARS}
            placeholder="What stood out? Spoiler-free thoughts welcome."
            onChange={(event) =>
              setPayload((prev) => ({
                ...prev,
                comments: event.target.value,
              }))
            }
            sx={{
              width: "100%",
              minHeight: 96,
              boxSizing: "border-box",
              resize: "vertical",
              border: `1.5px solid ${tokens.colors.borderStrong}`,
              borderRadius: `${tokens.radius.button}px`,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.fonts.body,
              fontSize: 15,
              lineHeight: 1.5,
              padding: "12px 14px",
              outline: "none",
              transition: `border-color ${tokens.motion.quick}`,
              "&::placeholder": {
                color: tokens.colors.textMuted,
              },
              "&:hover": {
                borderColor: tokens.colors.accent,
              },
              "&:focus": {
                borderColor: tokens.colors.accent,
              },
            }}
          />
          <Typography
            sx={{
              mt: 0.75,
              fontSize: 12,
              textAlign: "right",
              color:
                charCount >= MAX_CHARS
                  ? tokens.colors.danger
                  : tokens.colors.textMuted,
            }}
          >
            {charCount}/{MAX_CHARS}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: helperMessage ? "space-between" : "flex-end",
            gap: 1.25,
          }}
        >
          {helperMessage ? (
            <Typography
              sx={{ fontSize: 12, color: tokens.colors.textMuted }}
            >
              {helperMessage}
            </Typography>
          ) : null}
          <Box sx={{ display: "flex", gap: 1.25, flexShrink: 0 }}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isDisabled}
              onClick={handleSubmitRating}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddRatingModal;
