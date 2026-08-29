import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const listToString = (list) => {
  if (typeof list === "string") {
    return list;
  }

  if (!list?.length) {
    return "";
  }

  return list.join(", ");
};

const MediaMetadata = ({ mediaType, mediaInfo }) => {
  const config = {
    movie: [
      { label: "Synopsis", dataKey: "description", isSynopsis: true },
      { label: "Director", dataKey: "director" },
      { label: "Producer", dataKey: "producer" },
      { label: "Cast", dataKey: "cast", wide: true },
    ],
    tv: [
      { label: "Synopsis", dataKey: "description", isSynopsis: true },
      { label: "Director", dataKey: "director" },
      { label: "Producer", dataKey: "producer" },
      { label: "Cast", dataKey: "cast", wide: true },
    ],
    music: [
      { label: "Album", dataKey: "album" },
      { label: "Artist", dataKey: "artist" },
    ],
    book: [
      { label: "Synopsis", dataKey: "description", isSynopsis: true },
      { label: "Author", dataKey: "author" },
      { label: "Genre", dataKey: "genre" },
    ],
  }[mediaType?.toLowerCase()];

  if (!config) {
    return null;
  }

  const fields = config
    .map((field) => ({ ...field, value: listToString(mediaInfo?.[field.dataKey]) }))
    .filter((field) => field.value);

  const synopsis = fields.find((field) => field.isSynopsis);
  const specs = fields.filter((field) => !field.isSynopsis);

  return (
    <Box>
      {synopsis ? (
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.6,
            color: tokens.colors.textPrimary,
            mb: specs.length ? 2.5 : 0,
          }}
        >
          {synopsis.value}
        </Typography>
      ) : null}

      {specs.length ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            columnGap: 3,
            rowGap: 1.75,
          }}
        >
          {specs.map(({ label, value, wide }) => (
            <Box key={label} sx={{ gridColumn: wide ? "1 / -1" : "auto" }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: tokens.colors.textMuted,
                  mb: 0.5,
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: tokens.colors.textPrimary,
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default MediaMetadata;
