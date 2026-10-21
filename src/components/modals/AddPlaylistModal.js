import React, { useContext, useState } from "react";
import { Box, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import TextAreaField from "../../shared/inputfield/TextAreaField";
import UserContext from "../../shared/context/userContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokens } from "../../styles/tokens";

const GENERIC_ERROR = "Couldn't create the playlist. Please try again.";

const AddPlaylistModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const createPlaylist = useMutation({
    mutationFn: (requestBody) => PlaylistClient.createPlaylist(requestBody),
    onSuccess: () => {
      // Every playlist list is keyed ["getAllPlaylistForUser", userName]
      // (DisplayPlaylistByUser, PlaylistContent); the prefix refreshes them all.
      queryClient.invalidateQueries({ queryKey: ["getAllPlaylistForUser"] });
      setName("");
      onClose();
    },
  });

  const onChangeName = (event) => {
    setName(event.target.value);
    if (createPlaylist.isError) {
      createPlaylist.reset();
    }
  };

  const handleClose = () => {
    createPlaylist.reset();
    onClose();
  };

  const handleSubmitPlaylist = () => {
    createPlaylist.mutate({ playlistName: name.trim() });
  };

  const errorMessage = createPlaylist.isError
    ? createPlaylist.error?.response?.data?.errors?.msg || GENERIC_ERROR
    : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          minHeight: 205,
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
        Add new playlist for {currentUser.userName}
      </DialogTitle>
      <Box sx={{ margin: "25px" }}>
        <Grid container>
          <Grid item xs={12}>
            <TextAreaField
              label="Enter name of new playlist"
              hasCharacterCount
              maxCharacters={50}
              minRows={1}
              value={name}
              name="comments"
              onChange={(e) => onChangeName(e)}
            ></TextAreaField>
          </Grid>
          {errorMessage && (
            <Grid item xs={12}>
              <Typography
                role="alert"
                sx={{
                  color: tokens.colors.danger,
                  fontFamily: tokens.fonts.body,
                  fontSize: 14,
                  mb: 1,
                }}
              >
                {errorMessage}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} container justifyContent="end">
            <PrimaryButton
              variant="contained"
              onClick={handleSubmitPlaylist}
              disabled={!name.trim() || createPlaylist.isLoading}
            >
              {createPlaylist.isLoading ? "Creating…" : "Submit"}
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default AddPlaylistModal;
