import React, { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";

const DisplayPlaylistByUser = ({ profileUserName, userViewingOwnProfile }) => {
  const [displayOnePlaylist, setDisplayOnePlaylist] = useState(false);
  const [playListId, setPlaylistId] = useState(null);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);

  const { data: playlistList, isLoading } = useQuery({
    queryKey: ["getAllPlaylistForUser", { profileUserName }],
    queryFn: async () => {
      return await PlaylistClient.getAllPlaylistForUser(profileUserName);
    },
    staleTime: 60000,
    select: ({ data }) => data.data.playlistList.reverse(),
  });

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
        {isLoading ? (
          <ProfileWishlistLoading />
        ) : displayOnePlaylist ? (
          <DisplayOnePlaylist
            playListId={playListId}
            viewAllPlaylists={viewAllPlaylists}
            userViewingOwnProfile={userViewingOwnProfile}
          />
        ) : (
          displayPlaylist()
        )}
      </List>

      {openNewPlaylistModal && (
        <AddPlaylistModal
          open={openNewPlaylistModal}
          onClose={handleNewPlaylistModalClose}
          profileUserName={profileUserName}
        />
      )}
    </Box>
  );
};

export default DisplayPlaylistByUser;
