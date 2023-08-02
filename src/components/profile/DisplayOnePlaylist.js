import React, { useEffect, useState } from "react";
import { theme } from "../../Theme/Theme";
import { Box, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { Provider } from "jotai";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import PlaylistClient from "../../client/PlaylistClient";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Button from "@mui/material/Button";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import List from "@mui/material/List";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddMediaToPlaylistModal from "../modals/AddMediaToPlaylistModal";

const DisplayOnePlaylist = ({ playListId, user, viewAllPlaylists }) => {
  const [mediaByPlaylist, setMediaByPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAddMediaToPlaylistModal, setAddMediaToPlaylistModal] = useState(false);
  const [mediaAdded, setMediaAdded] = useState(0);

  useEffect(() => {
    getAllMediaForPlaylist();
  }, [playListId]);

  const getAllMediaForPlaylist = async () => {
    setLoading(true);
    const result = await PlaylistClient.getAllMediaForPlaylist(playListId);
    setMediaByPlaylist(result.data.mediaByPlaylist);
    setLoading(false);
  };

  const handleAddMediaToPlaylistModalOpen = () => {
    setAddMediaToPlaylistModal(true);
  };

  const handleAddMediaToPlaylistModalClose = () => {
    setAddMediaToPlaylistModal(false);
    if (mediaAdded > 0){
      getAllMediaForPlaylist();
    }
    setMediaAdded(0);
  };

  const displayMediaList = () => {
    const mediaList = mediaByPlaylist?.mediaList;
    return <>
      {mediaList && mediaList.length !== 0 && mediaList.map((media) => (
        <>
          <ListItem>
            <Stack
              direction="row"
              spacing={2}
              key={media._id}
            >
              <>
                <div>
                  <Stack direction="column">
                    <Typography component={Link} sx={{ textDecoration: "none" }}
                                to={`/${media.mediaType}/${media.mediaId}`}>
                      {media.name}
                    </Typography>
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
            <Button
              variant="outlined"
              startIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
              sx={{
                border: "transparent",
                borderRadius: "17px",
                justifyContent: "flex-start",
                marginBottom: "10px",
                "&.MuiButtonBase-root:hover": {
                  border: "transparent",
                  backgroundColor: "#ffffff"
                }
              }}
              onClick={() => viewAllPlaylists()}
            >
              <Typography variant="normalText" sx={{ color: "#000", fontSize: "11px" }}>
                Return
              </Typography>
            </Button>
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
              onClick={handleAddMediaToPlaylistModalOpen}
            >
              <Typography variant="normalText" sx={{ color: "#00a8ff" }}>
                Add Media to Playlist
              </Typography>
            </Button>
              <>
                <Typography
                  sx={{
                    marginLeft: "22px",
                    marginTop: "10px",
                    fontWeight: "bold"
                  }}
                >
                  {mediaByPlaylist?.playlist?.name}
                </Typography>
                <List component="nav">
                  {loading ? (<ProfileWishlistLoading />) :
                    displayMediaList()
                  }
                </List>
              </>
          </Box>
          {openAddMediaToPlaylistModal && (
            <AddMediaToPlaylistModal open={openAddMediaToPlaylistModal} onClose={handleAddMediaToPlaylistModalClose}
                             user={user} mediaByPlaylist={mediaByPlaylist} setMediaAdded={setMediaAdded} mediaAdded={mediaAdded} />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default DisplayOnePlaylist;
