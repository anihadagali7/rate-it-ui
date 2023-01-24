import React from "react";
import { Card, Grid, Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";

const MediaInfoDesktopLoading = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 2, xl: 5 }} columns={{ md: 12 }} sx={{ marginTop: "20px" }}>
      <Grid item xs={6}>
        <Skeleton sx={{ height: 250, width: 200, marginLeft: "10px", marginTop: "20px" }} animation="wave"
                  variant="rectangular" />
      </Grid>
      <Grid item xs={6} align="center" justify="center" direction="column">
        <Stack spacing={4} sx={{ marginTop: "80px", marginLeft: '35px' }}>
          <Skeleton sx={{ height: 25, width: 150, marginLeft: "0px", marginTop: "20px" }} animation="wave"
                    variant="rounded" />
          <Skeleton sx={{ height: 25, width: 150, marginLeft: "35px", marginTop: "20px" }} animation="wave"
                    variant="rounded" />
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{marginBottom: "15px"}}>
        <Skeleton sx={{ height: 25, width: '90%', marginLeft: "10px", marginTop: "20px" }} animation="wave"
                  variant="text" />
        <Skeleton sx={{ height: 25, width: '70%', marginLeft: "10px", marginTop: "5px" }} animation="wave"
                  variant="text" />
        <Skeleton sx={{ height: 25, width: '90%', marginLeft: "10px", marginTop: "5px" }} animation="wave"
                  variant="text" />
        <Skeleton sx={{ height: 25, width: '70%', marginLeft: "10px", marginTop: "5px" }} animation="wave"
                  variant="text" />
      </Grid>
    </Grid>
  );
};

export default MediaInfoDesktopLoading;