import { Box, Grid, Skeleton } from "@mui/material";

const ProfileWishlistLoading = () => {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={6} sm={4} md={3} key={item}>
          <Skeleton variant="rounded" height={260} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileWishlistLoading;
