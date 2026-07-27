import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../styles/tokens";

const LikeButton = ({
  initialLiked = false,
  initialCount = 0,
  disabled = false,
  isLoading = false,
  onToggle,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    const previousLiked = liked;
    const previousCount = count;
    const nextLiked = !liked;

    setLiked(nextLiked);
    setCount(previousCount + (nextLiked ? 1 : -1));

    if (!onToggle) return;

    try {
      await onToggle(nextLiked);
    } catch (error) {
      setLiked(previousLiked);
      setCount(previousCount);
    }
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={handleToggle}
      disabled={disabled || isLoading}
      aria-label={liked ? "Unlike" : "Like"}
      aria-pressed={liked}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        border: "none",
        background: "none",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        padding: "4px 8px",
        borderRadius: `${tokens.radius.button}px`,
        color: liked ? tokens.colors.danger : tokens.colors.textSecondary,
        opacity: disabled ? 0.5 : 1,
        "&:hover":
          disabled || isLoading
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
