import React, { useState, useContext, useEffect } from "react";
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
import PlaylistClient from "../../client/PlaylistClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import UserContext from "../../shared/context/userContext";

const PlaylistContent = ({
  onSearchChange,
  onToggleSelect,
  onCreateNew,
  mediaId,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [playlistsWithThisMedia, setPlaylistsWithThisMedia] = useState([]);
  const { currentUser } = useContext(UserContext);

  const { data: playlists } = useQuery({
    queryKey: ["getAllPlaylistForUser", currentUser.userName],
    queryFn: async () => {
      return await PlaylistClient.getAllPlaylistForUser(currentUser.userName);
    },
    staleTime: 60000,
    enabled: !!currentUser.userName,
    select: ({ data }) => data.data.playlistList,
  });

  const { mutate: getPlaylistsWithThisMedia } = useMutation({
    mutationFn: async () => {
      const response = PlaylistClient.getPlaylistsWithThisMedia({
        mediaId: mediaId,
        userName: currentUser.userName,
      });
      return response;
    },
    onSuccess: (response) => {
      const result = response.data.data.selectedPlaylists;
      setPlaylistsWithThisMedia(result);

      let idList = [];

      result.length > 0 &&
        result.forEach((playlist) => {
          idList.push(playlist._id);
        });

      setSelectedPlaylists((prev) => [...prev, ...idList]);
    },
  });

  useEffect(() => {
    getPlaylistsWithThisMedia();
  }, [mediaId]);

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
        {playlists &&
          playlists.map((playlist) => (
            <ListItem key={playlist._id}>
              <Checkbox checked={selectedPlaylists.includes(playlist._id)} />
              <ListItemText primary={playlist.name} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default PlaylistContent;
