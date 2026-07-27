import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const LABELS = {
  movie: "Movie",
  movies: "Movie",
  tv: "TV",
  "tv show": "TV",
  "tv shows": "TV",
  tvshow: "TV",
  tvshows: "TV",
  music: "Music",
  book: "Book",
  books: "Book",
  user: "Person",
  person: "Person",
};

const normalizeType = (type) =>
  String(type || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const MediaTypeBadge = ({ type }) => {
  const normalized = normalizeType(type);
  const label = LABELS[normalized] || type;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1,
        py: 0.25,
        borderRadius: `${tokens.radius.button}px`,
        backgroundColor: tokens.colors.accentSubtle,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      <Typography
        sx={{
          fontFamily: tokens.fonts.body,
          fontSize: 11,
          fontWeight: 700,
          color: tokens.colors.accent,
          lineHeight: 1.2,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default MediaTypeBadge;
