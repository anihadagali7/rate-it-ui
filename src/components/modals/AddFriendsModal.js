import React, { useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "../../styles/Theme";
import { Provider } from "jotai";
import UserClient from "../../client/UserClient";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import SearchClient from "../../client/SearchClient";
import SearchIcon from "@mui/icons-material/Search";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const AddFriendsModal = ({
  open,
  onClose,
  currentUser,
  friendsAdded,
  setFriendsAdded,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    if (searchKeyword.length > 0) {
      setLoading(true);
      setHasSearched(true);

      const result = await SearchClient.searchMedia(
        "user",
        searchKeyword,
        null
      );
      const finalList = result.data.mediaList;
      setSearchResults(finalList);
    }
    setLoading(false);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const unFollowUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.unFollowUser(currentUser, userToUnfollow);
    handleSearch();
    result === 200 && setFriendsAdded(friendsAdded + 1);
  };

  const followUser = async (currentUser, userToFollow) => {
    let result = await UserClient.followUser(currentUser, userToFollow);
    handleSearch();
    result === 200 && setFriendsAdded(friendsAdded + 1);
  };

  const determineActionButton = (profile) => {
    if (profile.userName === currentUser.userName) {
      return <></>;
    } else if (
      profile &&
      profile.followers &&
      profile.followers.includes(currentUser && currentUser.userName)
    ) {
      return (
        <PrimaryButton
          variant="outlined"
          onClick={() => unFollowUser(currentUser.userName, profile.userName)}
        >
          Following
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          variant="contained"
          onClick={() => followUser(currentUser.userName, profile.userName)}
        >
          Follow
        </PrimaryButton>
      );
    }
  };

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog
              open={open}
              onClose={onClose}
              sx={{
                "& .MuiDialog-paper": {
                  width: "100%",
                  height: 500,
                  maxWidth: 400,
                  overflowY: "hidden",
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
                Add Friends
              </DialogTitle>
              <Container maxWidth={"sm"} sx={{ marginTop: "10px" }}>
                <Box sx={{ width: "100%" }}>
                  <Paper
                    elevation={4}
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
                      marginRight: "auto",
                    }}
                  >
                    <TextField
                      sx={{
                        width: "100%",
                        "& fieldset": {
                          border: "none",
                        },
                      }}
                      size="small"
                      placeholder="Search for users"
                      value={searchKeyword}
                      onChange={onChangeSearch}
                      required
                    />
                    {searchKeyword.length > 0 && (
                      <>
                        <PrimaryButton
                          variant="text"
                          onClick={resetSearch}
                          leftIcon={<ClearIcon />}
                        ></PrimaryButton>
                        <Divider
                          sx={{ height: 28, m: 0.5 }}
                          orientation="vertical"
                        />
                        <PrimaryButton
                          variant="text"
                          onClick={submitSearch}
                          leftIcon={<SearchIcon />}
                        ></PrimaryButton>
                      </>
                    )}
                  </Paper>
                  {hasSearched && (
                    <List component="nav" sx={{ margin: "0 10px" }}>
                      {searchResults && searchResults.length > 0 ? (
                        searchResults.map((profile) => (
                          <>
                            <ListItem>
                              <Stack direction="row" spacing={2}>
                                <>
                                  <Avatar
                                    onClick={onClose}
                                    sx={{
                                      bgcolor: "#00a8ff",
                                      textDecoration: "none",
                                    }}
                                    component={Link}
                                    to={`/profile/${profile.userName}`}
                                  >
                                    {profile.firstName[0]}
                                    {profile.lastName[0]}
                                  </Avatar>
                                  <div>
                                    <Stack
                                      direction="column"
                                      sx={{ textDecoration: "none" }}
                                      component={Link}
                                      onClick={onClose}
                                      to={`/profile/${profile.userName}`}
                                    >
                                      <Typography sx={{ fontWeight: "bold" }}>
                                        {profile.firstName} {profile.lastName}
                                      </Typography>
                                      <Typography>
                                        @{profile.userName}
                                      </Typography>
                                    </Stack>
                                  </div>
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "10px",
                                      margin: "0 0 50px 0",
                                    }}
                                  >
                                    {determineActionButton(profile)}
                                  </div>
                                </>
                              </Stack>
                            </ListItem>
                            <Divider />
                          </>
                        ))
                      ) : (
                        <div>No users match this search.</div>
                      )}
                    </List>
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

export default AddFriendsModal;
