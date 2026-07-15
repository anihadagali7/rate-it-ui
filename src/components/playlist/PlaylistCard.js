import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import { tokens } from "../../styles/tokens";

const PlaylistCard = ({ playlist, userName }) => {
  const posters = (playlist.posters || []).slice(0, 4);

  return (
    <Box
      component={Link}
      to={`/playlist/${userName}/${playlist._id}`}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: `${tokens.radius.card}px`,
        overflow: "hidden",
        backgroundColor: tokens.colors.surface,
        transition: "border-color 0.15s ease",
        "&:hover": {
          borderColor: tokens.colors.borderStrong,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: "100%",
          backgroundColor: tokens.colors.surfaceHover,
        }}
      >
        {posters.length > 0 ? (
          posters.map((posterUrl, index) => {
            const positions = [
              { top: "0", left: "0" },
              { top: "0", left: "50%" },
              { top: "50%", left: "0" },
              { top: "50%", left: "50%" },
            ];
            const isSingle = posters.length === 1;

            return (
              <Box
                key={`${playlist._id}-${index}`}
                component="img"
                src={posterUrl || NotFoundImage}
                alt=""
                sx={{
                  position: "absolute",
                  objectFit: "cover",
                  width: isSingle ? "100%" : "50%",
                  height: isSingle ? "100%" : "50%",
                  top: isSingle ? 0 : positions[index].top,
                  left: isSingle ? 0 : positions[index].left,
                }}
              />
            );
          })
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tokens.colors.textMuted,
              fontSize: 13,
            }}
          >
            No covers yet
          </Box>
        )}
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            textAlign: "center",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {playlist.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default PlaylistCard;
