import AddIcon from "@mui/icons-material/Add";
import { Box, Container, Paper, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AddPlaylistModal from "../components/modals/AddPlaylistModal";
import DisplayPlaylistByUser from "../components/playlist/DisplayPlaylistByUser";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";

const Playlist = () => {
  const { userName } = useParams();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.userName;
  const userViewingOwnProfile = userName === profileUserName;
  const [displayOnePlaylist, setDisplayOnePlaylist] = useState(false);
  const [playListId, setPlaylistId] = useState(null);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);

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

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginBottom: "25px", marginTop: "25px" }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            minHeight: "300px",
            height: "100%",
            backgroundColor: "#FFFFFF",
            margin: "auto",
            borderRadius: "17px",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              minHeight: "100vh",
              padding: 2,
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "22px",
                }}
              >
                Playlist
              </Typography>
              {userViewingOwnProfile && (
                <PrimaryButton
                  variant="contained"
                  leftIcon={<AddIcon />}
                  onClick={handleNewPlaylistModalOpen}
                >
                  Create
                </PrimaryButton>
              )}
            </Box>
            <DisplayPlaylistByUser userName={userName} profileView={false} />
          </Box>
        </Paper>
      </Container>

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

export default Playlist;
