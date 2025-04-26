import { Box, Grid, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";
import React from "react";

const IndividualSearchResultsLoading = () => {
  return (
    <Box sx={{ margin: "20px 0" }}>
      <Grid container sx={{ padding: "17px 0" }}>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
        >
          <Skeleton
            sx={{
              height: 400,
              width: 250,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
        >
          <Skeleton
            sx={{
              height: 400,
              width: 250,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
        >
          <Skeleton
            sx={{
              height: 400,
              width: 250,
            }}
            animation="wave"
            variant="rectangular"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
        >
          <Skeleton
            sx={{
              height: 350,
              width: 250,
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

export default IndividualSearchResultsLoading;
