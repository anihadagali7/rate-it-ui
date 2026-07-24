import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box } from "@mui/material";
import Button from "../../shared/buttons/Button";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
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
        sx={{ flex: isMobile ? 1 : "initial" }}
      >
        {hasRated
          ? userRating != null
            ? `Rated ${userRating}/10`
            : "Rated"
          : "Rate"}
      </Button>
      <Button
        variant="secondary"
        leftIcon={
          isOnWishlist ? (
            <FavoriteIcon sx={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          )
        }
        onClick={onWishlist}
        disabled={isWishlistLoading}
        sx={{
          flex: isMobile ? 1 : "initial",
          // Reserve space for the longer label so Rate / Playlist don't shift
          minWidth: isMobile ? undefined : 188,
        }}
      >
        {isOnWishlist ? "Saved to wishlist" : "Add to wishlist"}
      </Button>
      <Button
        variant="secondary"
        leftIcon={<PlaylistAddIcon sx={{ fontSize: 18 }} />}
        onClick={onPlaylist}
        sx={{ flex: isMobile ? 1 : "initial" }}
      >
        Add to playlist
      </Button>
    </Box>
  );
};

export default MediaActionBar;
