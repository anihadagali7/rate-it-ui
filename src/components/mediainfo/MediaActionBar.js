import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "../../shared/buttons/Button";
import { tokens } from "../../styles/tokens";

const SquareIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  width: 42,
  height: 42,
  borderRadius: `${tokens.radius.button}px`,
  border: `1px solid ${active ? tokens.colors.danger : tokens.colors.border}`,
  backgroundColor: active ? tokens.colors.signalSoft : tokens.colors.surface,
  color: active ? tokens.colors.danger : tokens.colors.textSecondary,
  transition: `background-color ${tokens.motion.quick}, border-color ${tokens.motion.quick}, color ${tokens.motion.quick}`,
  "&:hover": {
    backgroundColor: active
      ? tokens.colors.signalSoft
      : tokens.colors.surfaceHover,
    borderColor: active ? tokens.colors.danger : tokens.colors.borderStrong,
  },
  "&.Mui-disabled": {
    backgroundColor: tokens.colors.surfaceHover,
    color: tokens.colors.textMuted,
    borderColor: tokens.colors.border,
  },
}));

const MediaActionBar = ({
  onRate,
  onWishlist,
  onPlaylist,
  isMobile = false,
  isOnWishlist = false,
  isWishlistLoading = false,
  hasRated = false,
  userRating = null,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Button
        variant={hasRated ? "secondary" : "primary"}
        leftIcon={
          hasRated ? (
            <StarIcon sx={{ fontSize: 18 }} />
          ) : (
            <StarBorderIcon sx={{ fontSize: 18 }} />
          )
        }
        onClick={onRate}
        disabled={hasRated}
        sx={{ flex: isMobile ? 1 : "initial", minWidth: 0 }}
      >
        {hasRated
          ? userRating != null
            ? `Rated ${userRating}/10`
            : "Rated"
          : "Rate"}
      </Button>

      <Tooltip title={isOnWishlist ? "Saved to wishlist" : "Add to wishlist"}>
        <span>
          <SquareIconButton
            active={isOnWishlist}
            onClick={onWishlist}
            disabled={isWishlistLoading}
            aria-label={isOnWishlist ? "Saved to wishlist" : "Add to wishlist"}
          >
            {isOnWishlist ? (
              <FavoriteIcon sx={{ fontSize: 20 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
            )}
          </SquareIconButton>
        </span>
      </Tooltip>

      <Tooltip title="Add to playlist">
        <SquareIconButton onClick={onPlaylist} aria-label="Add to playlist">
          <PlaylistAddIcon sx={{ fontSize: 20 }} />
        </SquareIconButton>
      </Tooltip>
    </Box>
  );
};

export default MediaActionBar;
