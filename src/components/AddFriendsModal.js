import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";
import UserClient from "../client/UserClient";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

const AddFriendsModal = ({ open, onClose, currentUser }) => {

  const [usersList, setUsers] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const resetSearch = () => {
    setSearchKeyword("");
  };

  const getAllUsers = async () => {
    const result = await UserClient.getAllUsers();
    const index = result.data.findIndex(item => item.userName === currentUser.userName);
    result.data.splice(index, 1);
    setUsers(result.data);
  };

  const handleSearch = () => {
    setFilteredUsersList(usersList);
  };

  const filterUsers = (event) => {
    setSearchKeyword(event.target.value);
    const updatedList = usersList.filter(user => {
      return (
        user.userName.toLowerCase().search(event.target.value.toLowerCase()) !== -1 ||
        user.firstName.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });
    setFilteredUsersList(updatedList);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{ "& .MuiDialog-paper": { width: "100%", height: 500, maxWidth: 400, overflowY: "hidden" } }}>
              <DialogTitle
                sx={{ fontSize: "13px", fontWeight: "bold", height: "0px", textAlign: "center" }}>Add
                Friends</DialogTitle>
              <Container maxWidth={"sm"} sx={{ marginTop: "10px" }}>
                <Box sx={{ width: "100%" }}>
                  <Paper elevation={4}
                         component="form"
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
                      placeholder="Search for users using name or username"
                      value={searchKeyword}
                      onClick={handleSearch}
                      onChange={filterUsers}
                      required
                    />
                    {searchKeyword.length > 0 && (
                      <IconButton sx={{ p: "10px" }} onClick={resetSearch}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Paper>
                  {searchKeyword.length > 0 && (
                    <List component="nav" sx={{ margin: "0 10px" }}>
                      {filteredUsersList && filteredUsersList.length > 0 ? filteredUsersList.map((profile) => (
                          <>
                            <ListItem>
                              <Stack
                                direction="row"
                                spacing={2}
                              >
                                <>
                                  <Avatar
                                    sx={{ bgcolor: "#00a8ff", textDecoration: "none" }}
                                    component={Link}
                                    to={`/profile/${profile.userName}`}
                                    onClick={onClose}
                                  >
                                    {profile.firstName[0]}
                                    {profile.lastName[0]}
                                  </Avatar>
                                  <div>
                                    <Stack direction="column">
                                      <Typography sx={{ fontWeight: "bold" }}>
                                        {profile.firstName} {profile.lastName}
                                      </Typography>
                                      <Typography>@{profile.userName}</Typography>
                                    </Stack>
                                  </div>
                                </>
                              </Stack>
                            </ListItem>
                            {/*<Divider />*/}
                          </>
                        )) :
                        <div>No users match this search.</div>}
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