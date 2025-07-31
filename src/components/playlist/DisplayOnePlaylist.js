import AddIcon from "@mui/icons-material/Add";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PlaylistClient from "../../client/PlaylistClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import PlaylistCard from "./PlaylistCard";

const DisplayOnePlaylist = () => {
  const { userName, playlistId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.userName;
  const userViewingOwnProfile = userName === profileUserName;

  const { data: playlistDetails, isLoading } = useQuery({
    queryKey: ["getAllMediaForPlaylist", { playlistId }],
    queryFn: async () => {
      return await PlaylistClient.getAllMediaForPlaylist(playlistId);
    },
    staleTime: 60000,
    select: ({ data }) => data.data.mediaByPlaylist,
  });

  const displayMediaList = () => {
    const mediaList = playlistDetails?.mediaList;
    return (
      <>
        {mediaList &&
          mediaList.length !== 0 &&
          mediaList.map((media) => (
            <>
              <ListItem>
                <Stack direction="row" spacing={2} key={media._id}>
                  <>
                    <div>
                      <Stack direction="column">
                        <Typography
                          component={Link}
                          sx={{ textDecoration: "none" }}
                          to={`/${media.mediaType}/${media.mediaId}`}
                        >
                          {media.name}
                        </Typography>
                      </Stack>
                    </div>
                  </>
                </Stack>
              </ListItem>
              <Divider
                sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}
              />
            </>
          ))}
      </>
    );
  };

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginBottom: "25px", marginTop: "25px" }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            minHeight: "300px",
            height: "100%",
            backgroundColor: "#FFFFFF",
            margin: "auto",
            borderRadius: "17px",
            padding: "20px",
          }}
        >
          <Box>
            <PrimaryButton
              variant="text"
              leftIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
              onClick={() => navigate(-1)}
            >
              Return
            </PrimaryButton>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {playlistDetails && (
                <PlaylistCard
                  playlist={playlistDetails?.playlist}
                  userName={userName}
                />
              )}
            </Box>
            <List component="nav">
              {isLoading ? <ProfileWishlistLoading /> : displayMediaList()}
            </List>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DisplayOnePlaylist;
