import React from "react";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlaylistContent from "./PlaylistContent";

const MobilePlaylistDrawer = ({ open, onClose, playlists }) => {
  console.log("in mobile: ", playlists);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "90vh",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <PlaylistContent playlists={playlists} />
    </Drawer>
  );
};

export default MobilePlaylistDrawer;
