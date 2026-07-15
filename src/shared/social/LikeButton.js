import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../styles/tokens";

const LikeButton = ({ initialCount = 0, disabled = false }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleToggle = () => {
    if (disabled) return;
    setLiked((prev) => {
      setCount((current) => (prev ? current - 1 : current + 1));
      return !prev;
    });
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      aria-label={liked ? "Unlike" : "Like"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        border: "none",
        background: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "4px 8px",
        borderRadius: `${tokens.radius.button}px`,
        color: liked ? tokens.colors.danger : tokens.colors.textSecondary,
        opacity: disabled ? 0.5 : 1,
        "&:hover": disabled
          ? undefined
          : { backgroundColor: tokens.colors.surfaceHover },
      }}
    >
      {liked ? (
        <FavoriteIcon sx={{ fontSize: 18 }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: 18 }} />
      )}
      <Typography
        component="span"
        sx={{ fontSize: 13, fontWeight: 500, color: "inherit" }}
      >
        {count}
      </Typography>
    </Box>
  );
};

export default LikeButton;
