import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import WishlistClient from "../../client/WishlistClient";
import MediaCard from "../../shared/media/MediaCard";
import ProfileWishlistLoading from "../../shared/loading/ProfileWishlistLoading";
import EmptyState from "../../shared/primitives/EmptyState";
import QueryErrorState from "../../shared/errors/QueryErrorState";

const DisplayWishlistByUser = ({ userName }) => {
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
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DisplayWishlistByUser;
