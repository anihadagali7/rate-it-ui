import React, { useState, useContext } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { Link, useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";
import PlaylistClient from "../../client/PlaylistClient";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import List from "@mui/material/List";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddMediaToPlaylistModal from "../modals/AddMediaToPlaylistModal";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserContext from "../../shared/context/userContext";
import AddIcon from "@mui/icons-material/Add";

const DisplayOnePlaylist = () => {
  const { userName, playlistId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.userName;
  const userViewingOwnProfile = userName === profileUserName;
  const [openAddMediaToPlaylistModal, setAddMediaToPlaylistModal] =
    useState(false);
  const [mediaAdded, setMediaAdded] = useState(0);

  const { data: playlistDetails, isLoading } = useQuery({
    queryKey: ["getAllMediaForPlaylist", { playlistId }],
    queryFn: async () => {
      return await PlaylistClient.getAllMediaForPlaylist(playlistId);
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
          <Box>
            <PrimaryButton
              variant="text"
              leftIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
              onClick={() => navigate(-1)}
            >
              Return
            </PrimaryButton>

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
                {playlistDetails?.playlist?.name}
              </Typography>
              {userViewingOwnProfile && (
                <PrimaryButton
                  variant="contained"
                  onClick={handleAddMediaToPlaylistModalOpen}
                  leftIcon={<AddIcon />}
                >
                  Add
                </PrimaryButton>
              )}
            </Box>
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
        </Paper>
      </Container>
    </Box>
  );
};

export default DisplayOnePlaylist;
