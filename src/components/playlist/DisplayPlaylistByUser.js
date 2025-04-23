import React from "react";
import { useQuery } from "@tanstack/react-query";
import PlaylistClient from "../../client/PlaylistClient";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { Box, Typography } from "@mui/material";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import { Link } from "react-router-dom";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const DisplayPlaylistByUser = ({ userName, profileView }) => {
  const { data: playlistList, isLoading } = useQuery({
    queryKey: ["getAllPlaylistForUser", userName],
    queryFn: async () => {
      return await PlaylistClient.getAllPlaylistForUser(userName);
    },
    staleTime: 60000,
    enabled: !!userName,
    select: ({ data }) => data.data.playlistList.reverse(),
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
      <List component="nav">
        {isLoading ? (
          <ProfileWishlistLoading />
        ) : (
          newList &&
          newList.length > 0 &&
          newList.map((playlist) => (
            <>
              <ListItem key={playlist._id} sx={{ cursor: "pointer" }}>
                <Stack direction="row" spacing={2}>
                  <>
                    <div>
                      <Stack direction="column">
                        <span>
                          <Typography sx={{ textDecoration: "none" }}>
                            {playlist.name}
                          </Typography>
                        </span>
                      </Stack>
                    </div>
                  </>
                </Stack>
              </ListItem>
              <Divider
                sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}
              />
            </>
          ))
        )}
      </List>
      {profileView && (
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
