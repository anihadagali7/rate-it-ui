import { Typography } from "@mui/material";
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
      { label: "Synopsis", dataKey: "description", displayLabel: false },
      { label: "Director", dataKey: "director", displayLabel: true },
      { label: "Producer", dataKey: "producer", displayLabel: true },
      { label: "Cast", dataKey: "cast", displayLabel: true },
    ],
    tv: [
      { label: "Synopsis", dataKey: "description", displayLabel: false },
      { label: "Director", dataKey: "director", displayLabel: true },
      { label: "Producer", dataKey: "producer", displayLabel: true },
      { label: "Cast", dataKey: "cast", displayLabel: true },
    ],
    music: [
      { label: "Album", dataKey: "album", displayLabel: true },
      { label: "Artist", dataKey: "artist", displayLabel: true },
    ],
    book: [
      { label: "Synopsis", dataKey: "description", displayLabel: false },
      { label: "Author", dataKey: "author", displayLabel: true },
      { label: "Genre", dataKey: "genre", displayLabel: true },
    ],
  }[mediaType?.toLowerCase()];

  if (!config) {
    return null;
  }

  return (
    <>
      {config.map(({ label, dataKey, displayLabel }) => {
        const value = listToString(mediaInfo?.[dataKey]);
        if (!value) {
          return null;
        }

        return (
          <Typography
            key={label}
            sx={{
              fontSize: 14,
              lineHeight: 1.6,
              color: tokens.colors.textPrimary,
              mb: 1.5,
            }}
          >
            {!displayLabel ? (
              value
            ) : (
              <>
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, color: tokens.colors.textPrimary }}
                >
                  {label}:{" "}
                </Typography>
                {value}
              </>
            )}
          </Typography>
        );
      })}
    </>
  );
};

export default MediaMetadata;
