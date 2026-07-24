import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, IconButton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import WishlistClient from "../../client/WishlistClient";
import MediaCard from "../../shared/media/MediaCard";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import EmptyState from "../../shared/primitives/EmptyState";
import QueryErrorState from "../../shared/errors/QueryErrorState";
import UserContext from "../../shared/context/userContext";
import { tokens } from "../../styles/tokens";

const DisplayWishlistByUser = ({ userName, onRemoved }) => {
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const canRemove = currentUser?.userName === userName;

  const {
    data: wishlistList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getAllWishlistForUser", userName],
    queryFn: async () => await WishlistClient.getAllWishlistForUser(userName),
    staleTime: 60000,
    enabled: !!userName,
    select: ({ data }) => data.data.wishlistList,
  });

  const { mutate: removeFromWishlist, isLoading: isRemoving } = useMutation({
    mutationFn: async (mediaId) => {
      await WishlistClient.removeFromWishlist(mediaId);
      return mediaId;
    },
    onSuccess: (mediaId) => {
      queryClient.invalidateQueries({
        queryKey: ["getAllWishlistForUser", userName],
      });
      onRemoved?.(mediaId);
    },
  });

  if (isError) {
    return (
      <QueryErrorState
        message="Unable to load wishlist."
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <ProfileWishlistLoading />;
  }

  if (!wishlistList?.length) {
    return (
      <EmptyState
        title="Wishlist is empty"
        description="Saved media will appear here."
      />
    );
  }

  return (
    <Grid container spacing={2}>
      {wishlistList.map((item) => {
        const mediaType = item.media.mediaType?.toLowerCase();
        return (
          <Grid item xs={6} sm={4} md={3} key={item._id}>
            <Box sx={{ position: "relative" }}>
              {canRemove ? (
                <IconButton
                  aria-label={`Remove ${item.media.name} from wishlist`}
                  disabled={isRemoving}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removeFromWishlist(item.media.mediaId);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    width: 32,
                    height: 32,
                    backgroundColor: "rgba(20, 24, 31, 0.72)",
                    color: "#FBFCFB",
                    "&:hover": {
                      backgroundColor: tokens.colors.danger,
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "rgba(20, 24, 31, 0.4)",
                      color: "rgba(251, 252, 251, 0.5)",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              ) : null}
              <MediaCard
                item={{
                  mediaId: item.media.mediaId,
                  name: item.media.name,
                  poster: item.media.picture,
                  description: item.media.description,
                }}
                mediaType={mediaType}
                variant="grid"
              />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DisplayWishlistByUser;
