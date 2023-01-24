import React from "react";
import { Card, Grid, Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";

const MediaInfoMobileLoading = () => {
  return (
    <Grid container sx={{ marginTop: "20px" }}>
      <Grid item xs={12} align="center" justify="center">
        <Skeleton sx={{ height: 250, width: 200, marginTop: "20px" }} animation="wave"
                  variant="rectangular" />
      </Grid>
      <Grid item xs={12} align="center" justify="center">
        <Stack spacing={4} sx={{ marginTop: "10px", width: '100%' }}>
          <div>
            <Skeleton sx={{ height: 25, width: 150, marginTop: "20px" }} animation="wave"
                      variant="rounded" />
            <Skeleton sx={{ height: 25, width: 150, marginTop: "15px" }} animation="wave"
                      variant="rounded" />
          </div>

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

export default MediaInfoMobileLoading;