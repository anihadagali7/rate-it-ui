import React, { useState, useContext } from "react";
import { Box, Paper, Typography, Container } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ProfileWishlistLoading from "../shared/loading/ProfileWishlistLoading";
import PlaylistClient from "../client/PlaylistClient";
import DisplayOnePlaylist from "../components/playlist/DisplayOnePlaylist";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddPlaylistModal from "../components/modals/AddPlaylistModal";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import { useQuery } from "@tanstack/react-query";
import UserContext from "../shared/context/userContext";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const Playlist = () => {
  const { userName } = useParams();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.userName;
  const userViewingOwnProfile = userName === profileUserName;
  console.log("userName params: ", userName);
  console.log("currentUser: ", currentUser);
  console.log("profileUserName: ", profileUserName);
  console.log("userViewingOwnProfile: ", userViewingOwnProfile);
  const [displayOnePlaylist, setDisplayOnePlaylist] = useState(false);
  const [playListId, setPlaylistId] = useState(null);
  const [openNewPlaylistModal, setNewPlaylistModal] = useState(false);

  const { data: playlistList, isLoading } = useQuery({
    queryKey: ["getAllPlaylistForUser", { userName }],
    queryFn: async () => {
      return await PlaylistClient.getAllPlaylistForUser(userName);
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
