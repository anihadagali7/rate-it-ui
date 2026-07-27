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
    return item.description;
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
        gap: 0.75,
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
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto 4.2em auto",
          rowGap: 0.5,
          alignContent: "start",
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: tokens.colors.textSecondary,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {subtitle || "\u00A0"}
        </Typography>
        <Box>
          <MediaTypeBadge type={mediaType} />
        </Box>
      </Box>
    </Box>
  );
};

export default MediaCard;
