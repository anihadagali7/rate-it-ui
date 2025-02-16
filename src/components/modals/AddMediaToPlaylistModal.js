import React, { useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import PlaylistClient from "../../client/PlaylistClient";
import SearchClient from "../../client/SearchClient";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import MediaClient from "../../client/MediaClient";
import AddIcon from "@mui/icons-material/Add";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddMediaToPlaylistModal = ({ open, onClose, mediaByPlaylist }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const queryClient = useQueryClient();

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setHasSearched(false);
    }
  };

  const handleSearch = async (e) => {
    if (searchKeyword.length > 0) {
      setHasSearched(true);
      searchAllMedia();
    }
  };

  const {
    isLoading: isSearchMediaLoading,
    mutate: searchAllMedia,
    isSuccess,
    data: searchResults,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await SearchClient.searchAllMedia(searchKeyword);
      return data.data.fullSearchList;
    },
    onSuccess: () => {},
  });

  const { mutateAsync: getMediaInfoDetails } = useMutation({
    mutationFn: async ({ mediaType, mediaId }) => {
      const { data } = await MediaClient.getMediaInfoDetails(
        mediaType,
        mediaId
      );
      return data.data.media;
    },
  });

  const { mutate: addMediaToPlaylist } = useMutation({
    mutationFn: async (requestBody) => {
      const { data } = await PlaylistClient.addMediaToPlaylist(requestBody);
      return data.data.media;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "getAllMediaForPlaylist",
          { playListId: mediaByPlaylist?.playlist?._id },
        ],
      });
      onClose();
    },
  });

  const handleAddMediaToPlaylist = async (playlistId, mediaId, mediaType) => {
    if (mediaType && mediaId) {
      try {
        const mediaInfo = await getMediaInfoDetails({ mediaType, mediaId });

        if (mediaInfo && mediaInfo._id) {
          const requestBody = {
            playlistId,
            mediaId: mediaInfo._id,
          };

          addMediaToPlaylist(requestBody);
        } 
      } catch (error) {
        console.error(
          "Error fetching media info or adding to playlist:",
          error
        );
      }
    } 
  };

  const submitSearch = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const checkToDisable = () => {
    return !searchKeyword;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          height: 500,
          maxWidth: 600,
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
        Add Media to {mediaByPlaylist?.playlist?.name}
      </DialogTitle>
      <Container maxWidth={"sm"} sx={{ margin: "30px 35px" }}>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            spacing={{ xs: 2, md: 2, xl: 2 }}
            columns={{ xs: 12 }}
            sx={{
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Grid item xs={9}>
              <PrimaryInputField
                value={searchKeyword}
                name="search"
                onChange={onChangeSearch}
              />
            </Grid>
            <Grid item xs={3}>
              <PrimaryButton
                variant="contained"
                disabled={checkToDisable()}
                onClick={submitSearch}
              >
                Search
              </PrimaryButton>
            </Grid>
          </Grid>
          {hasSearched && (
            <div
              style={{
                zIndex: "1000",
                overflowY: "auto",
                width: "100%",
                height: 350,
                maxWidth: 400,
              }}
            >
              <List component="nav" sx={{ margin: "0 10px" }}>
                {isSearchMediaLoading ? (
                  <ProfileWishlistLoading />
                ) : hasSearched && isSuccess && searchResults.length > 0 ? (
                  searchResults.map((media) => (
                    <>
                      <ListItem>
                        <Grid container>
                          <Grid
                            item
                            xs={3}
                            component={Link}
                            to={`/${media.mediaType}/${media.mediaId}`}
                            sx={{ textDecoration: "none" }}
                          >
                            <ListItemAvatar sx={{ marginTop: "15px" }}>
                              <img
                                width={50}
                                height={60}
                                style={{ marginBottom: "10px" }}
                                alt="poster"
                                src={
                                  media?.poster ? media.poster : NotFoundImage
                                }
                              />
                            </ListItemAvatar>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            component={Link}
                            to={`/${media.mediaType}/${media.mediaId}`}
                            sx={{ textDecoration: "none" }}
                          >
                            <Stack direction="column">
                              <Typography sx={{ fontWeight: "bold" }}>
                                {media.name.length > 15
                                  ? `${media.name.substring(0, 15)}...`
                                  : media.name}
                              </Typography>
                              <Typography component="div">
                                {media.mediaType.charAt(0).toUpperCase() +
                                  media.mediaType.slice(1)}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={3}>
                            <PrimaryButton
                              variant="outlined"
                              leftIcon={
                                <AddIcon style={{ color: "#00a8ff" }} />
                              }
                              onClick={() => {
                                handleAddMediaToPlaylist(
                                  mediaByPlaylist?.playlist?._id,
                                  media?.mediaId,
                                  media?.mediaType
                                );
                              }}
                            >
                              Add
                            </PrimaryButton>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <Divider />
                    </>
                  ))
                ) : (
                  isSuccess &&
                  searchResults.length == 0 && (
                    <div>No media match this search.</div>
                  )
                )}
              </List>
            </div>
          )}
        </Box>
      </Container>
    </Dialog>
  );
};

export default AddMediaToPlaylistModal;
