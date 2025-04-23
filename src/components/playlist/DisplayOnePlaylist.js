import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import PlaylistClient from "../../client/PlaylistClient";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import List from "@mui/material/List";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddMediaToPlaylistModal from "../modals/AddMediaToPlaylistModal";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const DisplayOnePlaylist = ({
  playListId,
  viewAllPlaylists,
  userViewingOwnProfile,
}) => {
  const [openAddMediaToPlaylistModal, setAddMediaToPlaylistModal] =
    useState(false);
  const [mediaAdded, setMediaAdded] = useState(0);

  const { data: playlistDetails, isLoading } = useQuery({
    queryKey: ["getAllMediaForPlaylist", { playListId }],
    queryFn: async () => {
      return await PlaylistClient.getAllMediaForPlaylist(playListId);
    },
    staleTime: 60000,
    select: ({ data }) => data.data.mediaByPlaylist,
  });

  const handleAddMediaToPlaylistModalOpen = () => {
    setAddMediaToPlaylistModal(true);
  };

  const handleAddMediaToPlaylistModalClose = () => {
    setAddMediaToPlaylistModal(false);
  };

  const displayMediaList = () => {
    const mediaList = playlistDetails?.mediaList;
    return (
      <>
        {mediaList &&
          mediaList.length !== 0 &&
          mediaList.map((media) => (
            <>
              <ListItem>
                <Stack direction="row" spacing={2} key={media._id}>
                  <>
                    <div>
                      <Stack direction="column">
                        <Typography
                          component={Link}
                          sx={{ textDecoration: "none" }}
                          to={`/${media.mediaType}/${media.mediaId}`}
                        >
                          {media.name}
                        </Typography>
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
      <PrimaryButton
        variant="text"
        leftIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
        onClick={() => viewAllPlaylists()}
      >
        Return
      </PrimaryButton>

      <Typography
        sx={{
          marginLeft: "22px",
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        {playlistDetails?.playlist?.name}
      </Typography>
      {userViewingOwnProfile && (
        <PrimaryButton
          variant="text"
          onClick={handleAddMediaToPlaylistModalOpen}
          leftIcon={<PlaylistAddIcon style={{ color: "#00a8ff" }} />}
        >
          Add to this playlist
        </PrimaryButton>
      )}
      <List component="nav">
        {isLoading ? <ProfileWishlistLoading /> : displayMediaList()}
      </List>

      {openAddMediaToPlaylistModal && (
        <AddMediaToPlaylistModal
          open={openAddMediaToPlaylistModal}
          onClose={handleAddMediaToPlaylistModalClose}
          mediaByPlaylist={playlistDetails}
        />
      )}
    </Box>
  );
};

export default DisplayOnePlaylist;
