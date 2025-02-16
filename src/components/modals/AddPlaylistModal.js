import React, { useContext, useState } from "react";
import { Box, Dialog, DialogTitle, Grid } from "@mui/material";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import TextAreaField from "../../shared/inputfield/TextAreaField";
import UserContext from "../../shared/context/userContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddPlaylistModal = ({ open, onClose, profileUserName }) => {
  const [name, setName] = useState("");
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const createPlaylist = useMutation({
    mutationFn: (requestBody) => {
      PlaylistClient.createPlaylist(requestBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPlaylistForUser", { profileUserName }],
      });
      onClose();
    },
  });

  const handleSubmitPlaylist = async () => {
    let requestBody = {};
    requestBody.userName = currentUser.userName;
    requestBody.playlistName = name;
    createPlaylist.mutate(requestBody);
  };

  const checkToDisable = () => {
    return !name;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <Grid item xs={12} container justifyContent="end">
            <PrimaryButton
              variant="contained"
              onClick={handleSubmitPlaylist}
              disabled={checkToDisable()}
            >
              Submit
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default AddPlaylistModal;
