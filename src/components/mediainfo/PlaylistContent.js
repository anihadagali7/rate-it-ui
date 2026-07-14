import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo, useState } from "react";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";

const PlaylistContent = ({ mediaId, onClose, handleNewPlaylistModalOpen }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [initialPlaylists, setInitialPlaylists] = useState([]);
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const { data: playlists } = useQuery({
    queryKey: ["getAllPlaylistForUser", currentUser.userName],
    queryFn: async () => {
      return await PlaylistClient.getAllPlaylistForUser(currentUser.userName);
    },
    staleTime: 60000,
    enabled: !!currentUser.userName,
    select: ({ data }) => data.data.playlistList,
  });

  const { data: playlistsWithThisMedia } = useQuery({
    queryKey: ["playlistsWithThisMedia", mediaId, currentUser.userName],
    queryFn: async () => {
      const response = await PlaylistClient.getPlaylistsWithThisMedia(mediaId);
      return response.data.data.selectedPlaylists;
    },
    enabled: !!mediaId && !!currentUser.userName,
    onSuccess: (result) => {
      const idList = result.map((playlist) => playlist._id);

      setInitialPlaylists(idList);
      setSelectedPlaylists(idList);
    },
  });

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

  const addMediaToMultiplePlaylists = useMutation({
    mutationFn: async ({ playlistsToAdd, playlistsToRemove }) => {
      const response = PlaylistClient.addMediaToMultiplePlaylists({
        mediaId,
        playlistsToAdd,
        playlistsToRemove,
      });
      return response;
    },
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["playlistsWithThisMedia", mediaId, currentUser.userName],
      });
    },
  });

  const handleSave = async () => {
    const playlistsToAdd = selectedPlaylists.filter(
      (id) => !initialPlaylists.includes(id)
    );

    const playlistsToRemove = initialPlaylists.filter(
      (id) => !selectedPlaylists.includes(id)
    );

    if (playlistsToAdd.length === 0 && playlistsToRemove.length === 0) {
      return;
    }

    addMediaToMultiplePlaylists.mutate({
      playlistsToAdd,
      playlistsToRemove,
    });
  };

  const arePlaylistsEqual = (a, b) => {
    const idsA = [...a].sort();
    const idsB = [...b].sort();
    return JSON.stringify(idsA) === JSON.stringify(idsB);
  };

  const isSaveDisabled = arePlaylistsEqual(initialPlaylists, selectedPlaylists);

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
        <PrimaryButton
          variant="text"
          onClick={() => {
            onClose();
            handleNewPlaylistModalOpen();
          }}
        >
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
        <PrimaryButton
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Save
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default PlaylistContent;
