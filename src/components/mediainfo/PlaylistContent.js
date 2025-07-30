import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useState } from "react";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";

const PlaylistContent = ({
  onCreateNew,
  mediaId,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [initialPlaylists, setInitialPlaylists] = useState([]);
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

      setInitialPlaylists(idList);
      setSelectedPlaylists((prev) => [...prev, ...idList]);
    },
  });

  useEffect(() => {
    getPlaylistsWithThisMedia();
  }, [mediaId]);

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleToggle = (playlistId) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const filteredPlaylists = useMemo(() => {
    if (!searchKeyword) return playlists;
    return playlists?.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [playlists, searchKeyword]);

  const { mutate: addMediaToMultiplePlaylists } = useMutation({
    mutationFn: async (playlistsToAdd, playlistsToRemove) => {
      const response = PlaylistClient.addMediaToMultiplePlaylists({
        mediaId: mediaId,
        playlistsToAdd,
        playlistsToRemove,
        playlists: selectedPlaylists,
      });
      return response;
    },
    onSuccess: () => {},
  });

  const handleSave = async () => {
    const playlistsToAdd = selectedPlaylists.filter(
      (id) => !initialPlaylists.includes(id)
    );

    const playlistsToRemove = initialPlaylists.filter(
      (id) => !selectedPlaylists.includes(id)
    );

    if (playlistsToAdd.length === 0 && playlistsToRemove.length === 0) {
      console.log("nothing changed");
      return;
    }

    console.log("playlistsToAdd: ", playlistsToAdd);
    console.log("playlistsToRemove: ", playlistsToRemove);

    // await addMediaToMultiplePlaylists(playlistsToAdd, playlistsToRemove);

    console.log("completed saving");
  };

  console.log("selected playlists ", selectedPlaylists);

  return (
    <Box p={3}>
      <Box sx={{ marginTop: "30px" }}>
        <PrimaryInputField
          value={searchKeyword}
          placeholder={"Find a playlist"}
          name="search"
          onChange={onChangeSearch}
        />
      </Box>
      <Box
        sx={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <PrimaryButton variant="text" onClick={onCreateNew}>
          + New playlist
        </PrimaryButton>
      </Box>
      <Box sx={{ marginTop: "30px" }}>
        <FormGroup>
          {filteredPlaylists &&
            filteredPlaylists.map((playlist) => (
              <Box
                sx={{
                  margin: "10px",
                }}
                key={playlist._id}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => handleToggle(playlist._id)}
                      checked={selectedPlaylists.includes(playlist._id)}
                    />
                  }
                  label={playlist.name}
                  key={playlist._id}
                />
              </Box>
            ))}
        </FormGroup>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <PrimaryButton variant="contained" onClick={handleSave}>
          Save
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default PlaylistContent;
