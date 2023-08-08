import React, { useEffect, useState } from "react";
import { theme } from "../../Theme/Theme";
import { Box, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { Provider } from "jotai";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import PlaylistClient from "../../client/PlaylistClient";
import DisplayOnePlaylist from "./DisplayOnePlaylist";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Button from "@mui/material/Button";
import AddPlaylistModal from "../modals/AddPlaylistModal";

const DisplayPlaylistByUser = ({ user }) => {
  const [playlistList, setPlaylistList] = useState([]);
  const [displayOnePlaylist, setDisplayOnePlaylist] = useState(false);
  const [playListId, setPlaylistId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);
  const [playlistAdded, setPlaylistAdded] = useState(false);

  useEffect(() => {
    getPlaylistForUser();
  }, [playlistAdded, user]);

  const getPlaylistForUser = async () => {
    setLoading(true);
    const result = await PlaylistClient.getAllPlaylistForUser(user.userName);
    setPlaylistList(result.data.playlistList.reverse());
    setLoading(false);
  };

  const viewOnePlaylist = (playlist) => {
    setDisplayOnePlaylist(true);
    setPlaylistId(playlist._id);
  };

  const viewAllPlaylists = () => {
    setDisplayOnePlaylist(false);
    setPlaylistId(null);
  };

  const handleNewPlaylistModalOpen = () => {
    setNewPlaylistModal(true);
  };

  const handleNewPlaylistModalClose = () => {
    setNewPlaylistModal(false);
  };

  const displayPlaylist = () => {
    return <>
      <Button
        variant="outlined"
        startIcon={<PlaylistAddIcon style={{ color: "#00a8ff" }} />}
        sx={{
          border: "transparent",
          backgroundColor: "#ffffff",
          borderRadius: "17px",
          width: "100%",
          "&.MuiButtonBase-root:hover": {
            border: "transparent",
            backgroundColor: "#ffffff"
          }
        }}
        onClick={handleNewPlaylistModalOpen}
      >
        <Typography variant="normalText" sx={{ color: "#00a8ff" }}>
          Create New Playlist
        </Typography>
      </Button>
      {playlistList && playlistList.length > 0 && playlistList.map((playlist) => (
        <>
          <ListItem key={playlist._id} onClick={() => viewOnePlaylist(playlist)} sx={{cursor: "pointer"}}>
            <Stack
              direction="row"
              spacing={2}
            >
              <>
                <div>
                  <Stack direction="column">
                    <span>
                      <Typography sx={{ textDecoration: "none" }}>
                       {playlist.name}
                      </Typography>
                    </span>
                  </Stack>
                </div>
              </>
            </Stack>
          </ListItem>
          <Divider sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }} />
        </>
      ))}
    </>;
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              width: "100%",
              height: "100%"
            }}
          >
            <List component="nav">
              {loading ? (<ProfileWishlistLoading />) :
                displayOnePlaylist ?
                  (<DisplayOnePlaylist user={user} playListId={playListId} viewAllPlaylists={viewAllPlaylists} />) :
                  displayPlaylist()
              }
            </List>
          </Box>
          {openNewPlaylistModal && (
            <AddPlaylistModal open={openNewPlaylistModal} onClose={handleNewPlaylistModalClose}
                            user={user} playlistAdded={playlistAdded} setPlaylistAdded={setPlaylistAdded} />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default DisplayPlaylistByUser;
