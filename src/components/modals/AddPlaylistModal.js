import React, { useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { theme } from "../../styles/Theme";
import { Provider } from "jotai";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import StarIcon from "@mui/icons-material/Star";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const AddPlaylistModal = ({
  open,
  onClose,
  user,
  playlistAdded,
  setPlaylistAdded,
}) => {
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
            <Dialog
              open={open}
              onClose={onClose}
              sx={{
                "& .MuiDialog-paper": {
                  width: "100%",
                  maxHeight: 325,
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
                Add new playlist for {user.userName}
              </DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Container
                  maxWidth={"sm"}
                  sx={{ marginTop: "20px", marginBottom: "25px" }}
                >
                  <Paper
                    elevation={4}
                    component="form"
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "auto",
                      borderRadius: "17px",
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
                      placeholder="Enter name of new playlist"
                      multiline
                      value={name}
                      onChange={onChangeName}
                      required
                      helperText="Max character count: 100"
                      inputProps={{ maxLength: 100 }}
                    />
                    {name.length > 0 && (
                      <PrimaryButton
                        variant="text"
                        onClick={resetName}
                        leftIcon={<ClearIcon />}
                      ></PrimaryButton>
                    )}
                  </Paper>
                  <PrimaryButton
                    variant="outlined"
                    leftIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
                    onClick={handleSubmitPlaylist}
                  >
                    Submit
                  </PrimaryButton>
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
