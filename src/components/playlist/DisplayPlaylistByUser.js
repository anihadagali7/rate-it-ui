import { Box, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import PlaylistCard from "./PlaylistCard";
import QueryErrorState from "../../shared/errors/QueryErrorState";

const DisplayPlaylistByUser = ({ userName, profileView }) => {
  const {
    data: playlistList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getAllPlaylistForUser", userName],
    queryFn: async () => {
      return await PlaylistClient.getAllPlaylistForUser(userName);
    },
    staleTime: 60000,
    enabled: !!userName,
    select: ({ data }) => [...data.data.playlistList].reverse(),
  });

  let newList = [];
  if (playlistList) {
    if (profileView) {
      newList = playlistList.slice(0, 3);
    } else {
      newList = playlistList;
    }
  }

  return (
    <Box>
      {isError ? (
        <QueryErrorState
          message="Unable to load playlists."
          onRetry={refetch}
        />
      ) : (
      <Grid container spacing={2} sx={{ margin: "10px 0" }}>
        {newList &&
          newList.length > 0 &&
          newList.map((playlist, index) => (
            <Grid item xs={5} sm={4} md={4} lg={4} sx={{ margin: "10px" }}>
              <PlaylistCard
                playlist={playlist}
                userName={userName}
                key={index}
              />
            </Grid>
          ))}
      </Grid>
      )}
      {profileView && !isError && (
        <Box sx={{ margin: "10px", justifyContent: "center", display: "flex" }}>
          <PrimaryButton
            variant="outlined"
            buttonElement={Link}
            link={`/playlist/${userName}`}
          >
            See all playlists
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
};

export default DisplayPlaylistByUser;
