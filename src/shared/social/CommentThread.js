import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { tokens } from "../../styles/tokens";
import Button from "../buttons/Button";
import TextAreaField from "../inputfield/TextAreaField";
import UserAvatar from "../primitives/UserAvatar";
import LikeButton from "./LikeButton";

const formatCommentTime = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const CommentThread = ({
  comments = [],
  commentCount,
  currentUser = null,
  disabled = false,
  isSubmitting = false,
  onAdd,
  onDelete,
  onToggleLike,
  onRequireAuth,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const count = commentCount ?? comments.length;
  const canComment = !!currentUser && !disabled;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !onAdd || isSubmitting) return;

    await onAdd(text);
    setDraft("");
  };

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-label={`${count} ${count === 1 ? "comment" : "comments"}`}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: `${tokens.radius.button}px`,
          color: tokens.colors.textSecondary,
          "&:hover": { backgroundColor: tokens.colors.surfaceHover },
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
        <Typography
          component="span"
          sx={{ fontSize: 13, fontWeight: 500, color: "inherit" }}
        >
          {count} {count === 1 ? "comment" : "comments"}
        </Typography>
      </Box>

      <Box sx={{ flexBasis: "100%", width: "100%" }}>
        <Collapse in={expanded}>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${tokens.colors.border}`,
            }}
          >
            {comments.length === 0 ? (
              <Typography
                sx={{
                  fontSize: 13,
                  color: tokens.colors.textMuted,
                  mb: 1.5,
                }}
              >
                No comments yet.
              </Typography>
            ) : (
              <Stack spacing={1.5} sx={{ mb: 1.5 }}>
                {comments.map((comment) => {
                  const author = comment.commentedBy;
                  const canDelete =
                    currentUser &&
                    author?.userName === currentUser.userName &&
                    onDelete;

                  return (
                    <Box
                      key={comment._id}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                      }}
                    >
                      <UserAvatar
                        src={author?.picture}
                        firstName={author?.firstName}
                        lastName={author?.lastName}
                        userName={author?.userName}
                        size="sm"
                        href={
                          author?.userName
                            ? `/profile/${author.userName}`
                            : undefined
                        }
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 0.75,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            component={author?.userName ? Link : "span"}
                            to={
                              author?.userName
                                ? `/profile/${author.userName}`
                                : undefined
                            }
                            sx={{
                              fontSize: 13,
                              fontWeight: 650,
                              color: tokens.colors.textPrimary,
                              textDecoration: "none",
                              "&:hover": author?.userName
                                ? { textDecoration: "underline" }
                                : undefined,
                            }}
                          >
                            {author?.firstName} {author?.lastName}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: tokens.colors.textMuted,
                            }}
                          >
                            @{author?.userName} ·{" "}
                            {formatCommentTime(comment.dateCreated)}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: tokens.colors.textPrimary,
                            lineHeight: 1.45,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {comment.text}
                        </Typography>
                        <Box sx={{ mt: 0.25, ml: -1 }}>
                          <LikeButton
                            initialLiked={!!comment.likedByCurrentUser}
                            initialCount={comment.likeCount ?? 0}
                            disabled={!onToggleLike}
                            onToggle={
                              onToggleLike
                                ? async (shouldLike) => {
                                    if (!currentUser) {
                                      onRequireAuth?.();
                                      // Revert LikeButton's optimistic
                                      // update since nothing actually
                                      // happened.
                                      throw new Error("Sign in required");
                                    }
                                    return onToggleLike(
                                      comment._id,
                                      shouldLike
                                    );
                                  }
                                : undefined
                            }
                          />
                        </Box>
                      </Box>
                      {canDelete ? (
                        <IconButton
                          aria-label="Delete comment"
                          size="small"
                          onClick={() => onDelete(comment._id)}
                          sx={{ color: tokens.colors.textMuted }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      ) : null}
                    </Box>
                  );
                })}
              </Stack>
            )}

            {canComment ? (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <TextAreaField
                  placeholder="Write a comment..."
                  name="comment"
                  value={draft}
                  minRows={2}
                  disabled={isSubmitting}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="primary"
                    submitButton
                    disabled={isSubmitting || !draft.trim()}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            ) : !currentUser ? (
              <Box
                component="button"
                type="button"
                onClick={() => onRequireAuth?.()}
                sx={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: 13,
                  color: tokens.colors.accent,
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign in to leave a comment.
              </Box>
            ) : (
              <Typography
                sx={{ fontSize: 13, color: tokens.colors.textMuted }}
              >
                Commenting is disabled.
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default CommentThread;
