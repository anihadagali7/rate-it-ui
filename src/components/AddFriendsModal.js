import React, { useEffect, useState } from "react";
import { Box, Container, Dialog, DialogTitle, StyledEngineProvider, TextField, ThemeProvider } from "@mui/material";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";
import UserClient from "../client/UserClient";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";

const AddFriendsModal = ({ open, onClose, userName, openingTab, currentUser }) => {
  const [usersList, setUsers] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const resetSearch = () => {
    setSearchKeyword("");
  };

  const getAllUsers = async () => {
    const result = await UserClient.getAllUsers();
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

  const selectBox = filteredUsersList.map(user => (
    <li key={user.userName}>{user.userName}</li>
  ));

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{ "& .MuiDialog-paper": { width: "100%", height: 300, maxWidth: 500, overflowY: "hidden" } }}>
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
                           width: "75%",
                           borderRadius: "17px",
                           marginTop: "20px",
                           marginLeft: 'auto',
                           marginRight: 'auto'
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
                  {searchKeyword.length > 0 && selectBox && <ul>{selectBox}</ul>}
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