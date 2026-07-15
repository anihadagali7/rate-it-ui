import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import StarIcon from "@mui/icons-material/Star";
import { Box } from "@mui/material";
import Button from "../../shared/buttons/Button";

const MediaActionBar = ({
  onRate,
  onWishlist,
  onPlaylist,
  isMobile = false,
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
        variant="primary"
        leftIcon={<StarIcon sx={{ fontSize: 18 }} />}
        onClick={onRate}
        sx={{ flex: isMobile ? 1 : "initial" }}
      >
        Rate
      </Button>
      <Button
        variant="secondary"
        leftIcon={<FavoriteBorderIcon sx={{ fontSize: 18 }} />}
        onClick={onWishlist}
        sx={{ flex: isMobile ? 1 : "initial" }}
      >
        Add to wishlist
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
