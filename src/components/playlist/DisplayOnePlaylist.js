import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PlaylistClient from "../../client/PlaylistClient";
import MediaCard from "../../shared/media/MediaCard";
import Button from "../../shared/buttons/Button";
import FeedLayout from "../../shared/layout/FeedLayout";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import EmptyState from "../../shared/primitives/EmptyState";
import QueryErrorState from "../../shared/errors/QueryErrorState";
import { tokens } from "../../styles/tokens";

const DisplayOnePlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const {
    data: playlistDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getAllMediaForPlaylist", { playlistId }],
    queryFn: async () => {
      return await PlaylistClient.getAllMediaForPlaylist(playlistId);
    },
    staleTime: 60000,
    select: ({ data }) => data.data.mediaByPlaylist,
  });

  const mediaList = playlistDetails?.mediaList || [];
  const playlistName = playlistDetails?.playlist?.name;

  return (
    <FeedLayout>
      <Button
        variant="ghost"
        leftIcon={<KeyboardBackspaceIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {playlistName ? (
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: tokens.colors.textPrimary,
            mb: 2,
          }}
        >
          {playlistName}
        </Typography>
      ) : null}

      {isLoading ? <ProfileWishlistLoading /> : null}

      {isError ? (
        <QueryErrorState
          message="Unable to load playlist media."
          onRetry={refetch}
        />
      ) : null}

      {!isLoading && !isError && mediaList.length > 0 ? (
        <Grid container spacing={2}>
          {mediaList.map((media) => {
            const mediaType = media.mediaType?.toLowerCase();

            return (
              <Grid item xs={6} sm={4} md={3} key={media._id}>
                <MediaCard
                  item={{
                    mediaId: media.mediaId,
                    name: media.name,
                    poster: media.picture,
                    description: media.description,
                  }}
                  mediaType={mediaType}
                  variant="grid"
                />
              </Grid>
            );
          })}
        </Grid>
      ) : null}

      {!isLoading && !isError && mediaList.length === 0 ? (
        <EmptyState
          title="This playlist is empty"
          description="Add media from a title page to build your playlist."
        />
      ) : null}
    </FeedLayout>
  );
};

export default DisplayOnePlaylist;
