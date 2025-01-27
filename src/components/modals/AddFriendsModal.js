import { Box, Dialog, DialogTitle, Grid } from "@mui/material";
import List from "@mui/material/List";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import SearchClient from "../../client/SearchClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import ProfileCard from "../profilecard/ProfileCard";

const AddFriendsModal = ({ open, onClose }) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const {
    mutate: submitSearch,
    isSuccess,
    data: searchResults,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await SearchClient.searchMedia("user", searchKeyword);
      return data.data.mediaList;
    },
    onSuccess: () => {},
  });

  const checkToDisable = () => {
    return searchKeyword === "";
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
              onClick={() => submitSearch()}
              disabled={checkToDisable()}
            >
              Search
            </PrimaryButton>
          </Grid>
        </Grid>
        {isSuccess && (
          <List component="nav" sx={{ margin: "0 10px" }}>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((profile) => (
                <ProfileCard
                  profile={profile}
                  onClose={onClose}
                  reSearch={() => submitSearch()}
                />
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
