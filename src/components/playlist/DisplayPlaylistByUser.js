import { Box, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PlaylistClient from "../../client/PlaylistClient";
import QueryErrorState from "../../shared/errors/QueryErrorState";
import EmptyState from "../../shared/primitives/EmptyState";
import { tokens } from "../../styles/tokens";
import PlaylistCard from "./PlaylistCard";

const DisplayPlaylistByUser = ({ userName }) => {
  const {
    data: playlistList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getAllPlaylistForUser", userName],
    queryFn: async () => PlaylistClient.getAllPlaylistForUser(userName),
    staleTime: 60000,
    enabled: !!userName,
    select: ({ data }) => [...data.data.playlistList].reverse(),
  });

  if (isError) {
    return (
      <QueryErrorState
        message="Unable to load playlists."
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item}>
            <Box
              sx={{
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: `${tokens.radius.card}px`,
                height: 220,
                backgroundColor: tokens.colors.surfaceHover,
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!playlistList?.length) {
    return (
      <EmptyState
        title="No playlists yet"
        description="Playlists will show up here once they are created."
      />
    );
  }

  return (
    <Grid container spacing={2}>
      {playlistList.map((playlist) => (
        <Grid item xs={6} sm={4} md={3} key={playlist._id}>
          <PlaylistCard playlist={playlist} userName={userName} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DisplayPlaylistByUser;
