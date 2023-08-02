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
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import PlaylistClient from "../../client/PlaylistClient";


const AddPlaylistModal = ({ open, onClose, user, playlistAdded, setPlaylistAdded }) => {
  const [name, setName] = useState("");

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const resetName = () => {
    setName("");
  };

  const handleSubmitPlaylist = async () => {
    let requestBody = {};
    requestBody.userName = user.userName;
    requestBody.playlistName = name;
    await PlaylistClient.createPlaylist(requestBody);
    setPlaylistAdded(!playlistAdded);
    onClose();
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
                        maxHeight: 325,
                        maxWidth: 400,
                        overflowY: "hidden"
                      }
                    }}>
              <DialogTitle
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "0px",
                  textAlign: "center"
                }}>Add new playlist for {user.userName}</DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Container
                  maxWidth={"sm"}
                  sx={{ marginTop: "20px", marginBottom: "25px" }}
                >
                  <Paper elevation={4}
                         component="form"
                         sx={{
                           p: "2px 4px",
                           display: "flex",
                           alignItems: "center",
                           width: "auto",
                           borderRadius: "17px"
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
                      placeholder="Enter name of new playlist"
                      multiline
                      value={name}
                      onChange={onChangeName}
                      required
                      helperText="Max character count: 100"
                      inputProps={{ maxLength: 100 }}
                    />
                    {name.length > 0 && (
                      <IconButton sx={{ p: "10px" }} onClick={resetName}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Paper>
                  <Button
                    variant="outlined"
                    startIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
                    sx={{
                      border: "transparent",
                      backgroundColor: "#00a8ff",
                      width: "100%",
                      borderRadius: "17px",
                      marginTop: "20px",
                      "&.MuiButtonBase-root:hover": {
                        border: "transparent",
                        backgroundColor: "#00a8ff"
                      }
                    }}
                    onClick={handleSubmitPlaylist}
                  >
                    <Typography variant="normalText">Submit</Typography>
                  </Button>
                </Container>
              </Box>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default AddPlaylistModal;