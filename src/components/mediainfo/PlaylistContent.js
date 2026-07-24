import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useState } from "react";
import PlaylistClient from "../../client/PlaylistClient";
import Button from "../../shared/buttons/Button";
import UserContext from "../../shared/context/userContext";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import { tokens } from "../../styles/tokens";

const PlaylistCover = ({ posters = [] }) => {
  const covers = posters.slice(0, 4);

  return (
    <Box
      sx={{
        position: "relative",
        width: 56,
        height: 56,
        flexShrink: 0,
        borderRadius: `${tokens.radius.button}px`,
        overflow: "hidden",
        backgroundColor: tokens.colors.surfaceHover,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      {covers.length > 0 ? (
        covers.map((posterUrl, index) => {
          const positions = [
            { top: 0, left: 0 },
            { top: 0, left: "50%" },
            { top: "50%", left: 0 },
            { top: "50%", left: "50%" },
          ];
          const isSingle = covers.length === 1;

          return (
            <Box
              key={`${posterUrl}-${index}`}
              component="img"
              src={posterUrl || NotFoundImage}
              alt=""
              sx={{
                position: "absolute",
                objectFit: "cover",
                width: isSingle ? "100%" : "50%",
                height: isSingle ? "100%" : "50%",
                top: isSingle ? 0 : positions[index].top,
                left: isSingle ? 0 : positions[index].left,
              }}
            />
          );
        })
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: tokens.fonts.display,
            fontSize: 11,
            fontWeight: 700,
            color: tokens.colors.textMuted,
            letterSpacing: "0.04em",
          }}
        >
          LIST
        </Box>
      )}
    </Box>
  );
};

const PlaylistOption = ({ playlist, selected, onToggle }) => {
  return (
    <Box
      component="button"
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={playlist.name}
      onClick={() => onToggle(playlist._id)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        width: "100%",
        textAlign: "left",
        border: `1.5px solid ${
          selected ? tokens.colors.accent : tokens.colors.border
        }`,
        backgroundColor: selected
          ? tokens.colors.accentSubtle
          : tokens.colors.surface,
        borderRadius: `${tokens.radius.card}px`,
        px: 1.5,
        py: 1.25,
        cursor: "pointer",
        transition: `all ${tokens.motion.quick}`,
        "&:hover": {
          borderColor: tokens.colors.accent,
          backgroundColor: selected
            ? tokens.colors.accentSubtle
            : tokens.colors.surfaceHover,
        },
      }}
    >
      <PlaylistCover posters={playlist.posters} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: tokens.fonts.display,
            fontSize: 15,
            fontWeight: 650,
            color: tokens.colors.textPrimary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {playlist.name}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: tokens.colors.textSecondary,
            mt: 0.25,
          }}
        >
          {selected ? "Selected" : "Tap to add"}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          backgroundColor: selected ? tokens.colors.accent : "transparent",
          border: selected
            ? `1.5px solid ${tokens.colors.accent}`
            : `1.5px solid ${tokens.colors.borderStrong}`,
          color: selected ? "#FBFCFB" : tokens.colors.textMuted,
          transition: `all ${tokens.motion.quick}`,
        }}
      >
        {selected ? <CheckIcon sx={{ fontSize: 18 }} /> : null}
      </Box>
    </Box>
  );
};

const PlaylistContent = ({
  mediaId,
  onClose,
  handleNewPlaylistModalOpen,
  onSuccess,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [initialPlaylists, setInitialPlaylists] = useState([]);
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const { data: playlists, isLoading: isPlaylistsLoading } = useQuery({
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
  });

  useEffect(() => {
    if (!playlistsWithThisMedia) {
      return;
    }
    const idList = playlistsWithThisMedia.map((playlist) => playlist._id);
    setInitialPlaylists(idList);
    setSelectedPlaylists(idList);
  }, [playlistsWithThisMedia]);

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
      const response = await PlaylistClient.addMediaToMultiplePlaylists({
        mediaId,
        playlistsToAdd,
        playlistsToRemove,
      });
      return response;
    },
    onSuccess: (_data, variables) => {
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["playlistsWithThisMedia", mediaId, currentUser.userName],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllPlaylistForUser"],
      });
      onSuccess?.(variables);
    },
  });

  const handleSave = () => {
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

  const isSaveDisabled =
    arePlaylistsEqual(initialPlaylists, selectedPlaylists) ||
    addMediaToMultiplePlaylists.isLoading;

  const selectedCount = selectedPlaylists.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <Box sx={{ px: { xs: 0.5, sm: 0 }, pb: 2 }}>
        <PrimaryInputField
          value={searchKeyword}
          placeholder="Search your playlists"
          name="search"
          onChange={(event) => setSearchKeyword(event.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: tokens.colors.textMuted, fontSize: 20 }} />
            </InputAdornment>
          }
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
          px: { xs: 0.5, sm: 0 },
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: tokens.colors.textMuted,
          }}
        >
          {selectedCount > 0
            ? `${selectedCount} selected`
            : "Your playlists"}
        </Typography>
        <Button
          variant="ghost"
          leftIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => {
            onClose();
            handleNewPlaylistModalOpen();
          }}
          sx={{ py: 0.5, px: 1 }}
        >
          New playlist
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: { xs: 0.5, sm: 0 },
          pb: 2,
        }}
      >
        {isPlaylistsLoading ? (
          <Typography sx={{ color: tokens.colors.textSecondary, py: 3 }}>
            Loading playlists…
          </Typography>
        ) : null}

        {!isPlaylistsLoading && filteredPlaylists?.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
              borderTop: `1px solid ${tokens.colors.border}`,
              borderBottom: `1px solid ${tokens.colors.border}`,
            }}
          >
            <Typography
              sx={{
                fontFamily: tokens.fonts.display,
                fontSize: 16,
                fontWeight: 700,
                color: tokens.colors.textPrimary,
                mb: 0.5,
              }}
            >
              {searchKeyword ? "No matches" : "No playlists yet"}
            </Typography>
            <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
              {searchKeyword
                ? "Try a different search."
                : "Create one to start collecting titles."}
            </Typography>
          </Box>
        ) : null}

        {filteredPlaylists?.map((playlist) => (
          <PlaylistOption
            key={playlist._id}
            playlist={playlist}
            selected={selectedPlaylists.includes(playlist._id)}
            onToggle={handleToggle}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.25,
          pt: 2,
          borderTop: `1px solid ${tokens.colors.border}`,
          px: { xs: 0.5, sm: 0 },
        }}
      >
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default PlaylistContent;
