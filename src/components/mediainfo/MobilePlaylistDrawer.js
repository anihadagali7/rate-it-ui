import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import PlaylistContent from "./PlaylistContent";
import { tokens } from "../../styles/tokens";

const MobilePlaylistDrawer = ({
  open,
  onClose,
  mediaId,
  handleNewPlaylistModalOpen,
  onSuccess,
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "88vh",
          borderTopLeftRadius: `${tokens.radius.card}px`,
          borderTopRightRadius: `${tokens.radius.card}px`,
          backgroundColor: tokens.colors.surface,
          borderTop: `1px solid ${tokens.colors.border}`,
          display: "flex",
          flexDirection: "column",
          px: 2.5,
          pt: 2,
          pb: 2.5,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: tokens.colors.borderStrong,
          mx: "auto",
          mb: 2,
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: tokens.colors.textMuted,
              mb: 0.5,
            }}
          >
            Collections
          </Typography>
          <Typography
            sx={{
              fontFamily: tokens.fonts.display,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: tokens.colors.textPrimary,
            }}
          >
            Add to playlist
          </Typography>
        </Box>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            color: tokens.colors.textMuted,
            "&:hover": {
              color: tokens.colors.textPrimary,
              backgroundColor: tokens.colors.surfaceHover,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <PlaylistContent
          mediaId={mediaId}
          onClose={onClose}
          handleNewPlaylistModalOpen={handleNewPlaylistModalOpen}
          onSuccess={onSuccess}
        />
      </Box>
    </Drawer>
  );
};

export default MobilePlaylistDrawer;
