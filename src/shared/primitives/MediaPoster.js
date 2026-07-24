import { Box } from "@mui/material";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import { tokens } from "../../styles/tokens";

const MediaPoster = ({
  src,
  alt,
  width = 80,
  height = 120,
  sx = {},
}) => {
  const isFullWidth = typeof width === "string";

  return (
    <Box
      sx={{
        width: isFullWidth ? width : width,
        height,
        flexShrink: 0,
        borderRadius: `${tokens.radius.button}px`,
        overflow: "hidden",
        border: `1px solid ${tokens.colors.border}`,
        backgroundColor: tokens.colors.surfaceHover,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={alt || "Media poster"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <MovieOutlinedIcon
          sx={{
            color: tokens.colors.textMuted,
            fontSize: typeof width === "number" ? width * 0.4 : 32,
          }}
        />
      )}
    </Box>
  );
};

export default MediaPoster;
