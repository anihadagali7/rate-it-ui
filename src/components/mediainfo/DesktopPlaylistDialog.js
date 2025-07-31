import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlaylistContent from "./PlaylistContent";

const DesktopPlaylistDialog = ({ open, onClose, mediaId }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          minHeight: 205,
          maxWidth: 300,
          overflowY: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "13px",
          fontWeight: "bold",
          height: "0px",
          textAlign: "center",
        }}
      >
        Add to playlist
      </DialogTitle>
      <DialogContent>
        <PlaylistContent mediaId={mediaId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default DesktopPlaylistDialog;
