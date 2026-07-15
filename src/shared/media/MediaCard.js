import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import MediaPoster from "../primitives/MediaPoster";
import { tokens } from "../../styles/tokens";
import MediaTypeBadge from "./MediaTypeBadge";

const getSubtitle = (item, mediaType) => {
  if (mediaType === "music") {
    return item.artists || item.albumName;
  }
  if (mediaType === "book") {
    return item.author;
  }
  if (item.description) {
    return item.description.length > 60
      ? `${item.description.slice(0, 60)}…`
      : item.description;
  }
  return null;
};

const MediaCard = ({ item, mediaType, variant = "carousel" }) => {
  const isGrid = variant === "grid";
  const posterWidth = isGrid ? "100%" : 140;
  const posterHeight = isGrid ? 200 : 200;
  const subtitle = getSubtitle(item, mediaType);

  return (
    <Box
      component={Link}
      to={`/${mediaType}/${item.mediaId}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: isGrid ? 0 : 140,
        maxWidth: isGrid ? "100%" : 160,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <MediaPoster
        src={item.poster || NotFoundImage}
        alt={item.name}
        width={posterWidth}
        height={posterHeight}
        sx={{ width: "100%", height: posterHeight }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.name}
        </Typography>
        {subtitle ? (
          <Typography
            sx={{
              fontSize: 12,
              color: tokens.colors.textSecondary,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
        <MediaTypeBadge type={mediaType} />
      </Box>
    </Box>
  );
};

export default MediaCard;
