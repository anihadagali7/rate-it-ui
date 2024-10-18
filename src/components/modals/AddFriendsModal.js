import React, { useContext, useState } from "react";
import { Box, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import UserClient from "../../client/UserClient";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import SearchClient from "../../client/SearchClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import UserContext from "../../shared/context/userContext";

const AddFriendsModal = ({
  open,
  onClose,
  friendsAdded,
  setFriendsAdded,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(UserContext);

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
          height: 400,
          maxWidth: 500,
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
      <Box sx={{ margin: "20px 10px" }}>
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
              onClick={submitSearch}
              disabled={checkToDisable()}
            >
              Search
            </PrimaryButton>
          </Grid>
        </Grid>
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
                            <Typography>@{profile.userName}</Typography>
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
    </Dialog>
  );
};

export default AddFriendsModal;
