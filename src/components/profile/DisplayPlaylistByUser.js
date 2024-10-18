import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import PlaylistClient from "../../client/PlaylistClient";
import DisplayOnePlaylist from "./DisplayOnePlaylist";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddPlaylistModal from "../modals/AddPlaylistModal";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";

const DisplayPlaylistByUser = ({ userViewingOwnProfile }) => {
  const [playlistList, setPlaylistList] = useState([]);
  const [displayOnePlaylist, setDisplayOnePlaylist] = useState(false);
  const [playListId, setPlaylistId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);
  const [playlistAdded, setPlaylistAdded] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    getPlaylistForUser();
  }, [playlistAdded, currentUser]);

  const getPlaylistForUser = async () => {
    setLoading(true);
    const result = await PlaylistClient.getAllPlaylistForUser(
      currentUser.userName
    );
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
    return (
      <>
        {userViewingOwnProfile && (
          <PrimaryButton
            variant="outlined"
            leftIcon={<PlaylistAddIcon style={{ color: "#00a8ff" }} />}
            onClick={handleNewPlaylistModalOpen}
          >
            Create New Playlist
          </PrimaryButton>
        )}
        {playlistList &&
          playlistList.length > 0 &&
          playlistList.map((playlist) => (
            <>
              <ListItem
                key={playlist._id}
                onClick={() => viewOnePlaylist(playlist)}
                sx={{ cursor: "pointer" }}
              >
                <Stack direction="row" spacing={2}>
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
              <Divider
                sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}
              />
            </>
          ))}
      </>
    );
  };

  return (
    <Box>
      <List component="nav">
        {loading ? (
          <ProfileWishlistLoading />
        ) : displayOnePlaylist ? (
          <DisplayOnePlaylist
            playListId={playListId}
            viewAllPlaylists={viewAllPlaylists}
          />
        ) : (
          displayPlaylist()
        )}
      </List>

      {openNewPlaylistModal && (
        <AddPlaylistModal
          open={openNewPlaylistModal}
          onClose={handleNewPlaylistModalClose}
          playlistAdded={playlistAdded}
          setPlaylistAdded={setPlaylistAdded}
        />
      )}
    </Box>
  );
};

export default DisplayPlaylistByUser;
