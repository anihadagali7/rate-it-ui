import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const LABELS = {
  movie: "Movie",
  tv: "TV",
  music: "Music",
  book: "Book",
  user: "Person",
};

const MediaTypeBadge = ({ type }) => {
  const label = LABELS[type?.toLowerCase()] || type;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1,
        py: 0.25,
        borderRadius: `${tokens.radius.pill}px`,
        backgroundColor: tokens.colors.accentSubtle,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: tokens.colors.accent,
          lineHeight: 1.2,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default MediaTypeBadge;
