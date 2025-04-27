import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";

const SearchResultsMobileLoading = () => {
  return (
    <Box sx={{ margin: "20px 0" }}>
      <Grid container sx={{ padding: "27px 3px" }}>
        <Grid item xs={4}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={4} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={2} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 60,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container sx={{ padding: "17px 0" }}>
        <Grid item xs={4}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={4} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={2} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 60,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container sx={{ padding: "17px 0" }}>
        <Grid item xs={4}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={4} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={2} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 60,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container sx={{ padding: "17px 0" }}>
        <Grid item xs={4}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={4} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 110,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid item xs={2} sx={{ marginLeft: "20px" }}>
          <Skeleton
            sx={{
              height: 150,
              width: 60,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
};

export default SearchResultsMobileLoading;
