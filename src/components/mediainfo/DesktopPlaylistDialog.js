import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import PlaylistContent from "./PlaylistContent";
import { tokens } from "../../styles/tokens";

const DesktopPlaylistDialog = ({
  open,
  onClose,
  mediaId,
  handleNewPlaylistModalOpen,
  onSuccess,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 440,
          maxHeight: "min(720px, 88vh)",
          borderRadius: `${tokens.radius.card}px`,
          border: `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.surface,
          boxShadow: tokens.shadows.lift,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(20, 24, 31, 0.45)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pt: 3,
          pb: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: tokens.fonts.body,
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

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          px: 3,
          pb: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PlaylistContent
          mediaId={mediaId}
          onClose={onClose}
          handleNewPlaylistModalOpen={handleNewPlaylistModalOpen}
          onSuccess={onSuccess}
        />
      </Box>
    </Dialog>
  );
};

export default DesktopPlaylistDialog;
