import React, { useState } from "react";
import {
  Box, Button,
  Container,
  Dialog,
  DialogTitle,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import PlaylistClient from "../../client/PlaylistClient";
import SearchClient from "../../client/SearchClient";
import SearchIcon from "@mui/icons-material/Search";
import SearchResultsDesktopLoading from "../../shared/loading/SearchResultsDesktopLoading";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import MediaClient from "../../client/MediaClient";

const AddMediaToPlaylistModal = ({ open, onClose, user, mediaByPlaylist }) => {

  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [displayTokenModal, setDisplayTokenModal] = useState(false);

  const resetSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
    setHasSearched(false);
    setLoading(false);
  };

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleSearch = async (e) => {
    if (searchKeyword.length > 0) {
      setLoading(true);
      setHasSearched(true);

      const result = await SearchClient.searchAllMedia(searchKeyword, setDisplayTokenModal);
      const finalList = result.data.fullSearchList;
      setSearchResults(finalList);
    }
    setLoading(false);
  };

  const addMediaToPlaylist = async (playlistId, mediaId, mediaType) => {
    let mediaDetails;
    if (mediaType && mediaId) {
      mediaDetails = await MediaClient.getMediaInfoDetails(mediaType, mediaId);
    }
    let requestBody = {};
    requestBody.playlistId = playlistId;
    requestBody.mediaId = mediaDetails?.data?.media?._id;
    let result = await PlaylistClient.addMediaToPlaylist(requestBody);
    result === 200 && setUpdateList(!updateList);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{
                      "& .MuiDialog-paper": {
                        width: "100%",
                        height: 500,
                        maxWidth: 400,
                      }
                    }}>
              <DialogTitle sx={{ fontSize: "13px", fontWeight: "bold", height: "0px", textAlign: "center" }}>
                Add Media to {mediaByPlaylist?.playlist?.name}
              </DialogTitle>
              <Container maxWidth={"sm"} sx={{ marginTop: "10px" }}>
                <Box sx={{ width: "100%" }}>
                  <Paper elevation={4}
                         component="form"
                         onSubmit={submitSearch}
                         sx={{
                           p: "2px 4px",
                           display: "flex",
                           alignItems: "center",
                           width: "85%",
                           borderRadius: "17px",
                           marginTop: "20px",
                           marginLeft: "auto",
                           marginRight: "auto"
                         }}
                  >
                    <TextField
                      sx={{
                        width: "100%",
                        "& fieldset": {
                          border: "none"
                        }
                      }}
                      size="small"
                      placeholder="Search for media"
                      value={searchKeyword}
                      onChange={onChangeSearch}
                      required
                    />
                    {searchKeyword.length > 0 && (
                      <IconButton sx={{ p: "10px" }} onClick={resetSearch}>
                        <ClearIcon />
                      </IconButton>
                    )}
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton sx={{ p: "10px" }} type="submit">
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                  {hasSearched && (
                    <div style={{zIndex: "1000", overflowY: "auto", width: "100%",
                      height: 350,
                      maxWidth: 400,}}>
                      <List component="nav" sx={{ margin: "0 10px" }}>
                        {loading ? (
                          <ProfileWishlistLoading />
                        ) : hasSearched && searchResults && searchResults.length > 0 ? searchResults.map((media) => (
                            <>
                              <ListItem component={Link} to={`/${media.mediaType}/${media.mediaId}`}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                >
                                  <>
                                    <ListItemAvatar sx={{ marginTop: "15px" }}>
                                      <img
                                        width={50}
                                        height={60}
                                        style={{ marginBottom: "10px" }}
                                        alt="poster"
                                        src={media?.poster ? media.poster : NotFoundImage}
                                      />
                                    </ListItemAvatar>
                                    <div>
                                      <Stack direction="column">
                                        <Typography sx={{ fontWeight: "bold" }}>
                                          {media.name.length > 15
                                            ? `${media.name.substring(0, 15)}...`
                                            : media.name}
                                        </Typography>
                                        <Typography component="div">
                                          {media.mediaType.charAt(0).toUpperCase() + media.mediaType.slice(1)}
                                        </Typography>
                                      </Stack>
                                    </div>
                                    <div style={{
                                      position: "absolute",
                                      right: "10px",
                                      margin: "0 0 50px 0"
                                    }}>
                                      <Button
                                        variant="outlined"
                                        sx={{
                                          borderRadius: "17px",
                                          marginTop: "30px",
                                          marginRight: "3px",
                                          width: "100%"
                                        }}
                                        onClick={() => addMediaToPlaylist(mediaByPlaylist?.playlist?._id, media?._id, media?.mediaType)}
                                      >
                                        <Typography component="div"
                                                    sx={{
                                                      fontSize: "12px",
                                                      color: "#00a8ff",
                                                      fontWeight: "bold"
                                                    }}
                                        >
                                          Add Media
                                        </Typography>
                                      </Button>
                                    </div>
                                  </>
                                </Stack>
                              </ListItem>
                              <Divider />
                            </>
                          )) :
                          <div>No users match this search.</div>}
                      </List>
                    </div>
                  )}
                </Box>
              </Container>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default AddMediaToPlaylistModal;