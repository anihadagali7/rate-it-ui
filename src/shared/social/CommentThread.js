import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Box, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../styles/tokens";
import TextAreaField from "../inputfield/TextAreaField";

const CommentThread = ({ commentCount = 0, disabled = true }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box
        component="button"
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
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
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </Typography>
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${tokens.colors.border}`,
          }}
        >
          {disabled ? (
            <Typography
              sx={{
                fontSize: 13,
                color: tokens.colors.textMuted,
                mb: 1.5,
              }}
            >
              Comment threads are coming soon.
            </Typography>
          ) : null}
          <TextAreaField
            placeholder="Write a comment..."
            disabled={disabled}
            name="comment"
            value=""
            onChange={() => {}}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default CommentThread;
