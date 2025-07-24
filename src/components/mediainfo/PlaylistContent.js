import React, { useState } from "react";
import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const PlaylistContent = ({
  playlists,
  selectedPlaylists,
  onSearchChange,
  onToggleSelect,
  onCreateNew,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setHasSearched(false);
    }
  };

  const onKeyDownSearch = (event) => {
    if (event.key === "Enter" && searchKeyword.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <Box p={3}>
      <Box sx={{ marginTop: "30px" }}>
        <PrimaryInputField
          value={searchKeyword}
          placeholder={"Find a playlist"}
          name="search"
          onChange={onChangeSearch}
          onKeyDown={onKeyDownSearch}
        />
      </Box>
      <Box
        sx={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <PrimaryButton variant="contained" onClick={onCreateNew}>
          + New playlist
        </PrimaryButton>
      </Box>
      <List>
        {playlists && playlists.map((playlist) => (
          <ListItem
            key={playlist.id}
            button
            // onClick={() => onToggleSelect(playlist.id)}
          >
            <Checkbox
              //   checked={selectedPlaylists.includes(playlist.id)}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={playlist.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PlaylistContent;
