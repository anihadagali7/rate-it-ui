import React from "react";
import { Grid, Skeleton } from "@mui/material";

const SearchResultsMobileLoading = () => {
  return (
    <Grid container>
      <Grid item xs={6} sx={{marginTop: '20px'}}>
        <Skeleton sx={{ height: 150, width: 125, marginLeft: "10px", marginTop: "17px" }} animation="wave"
                  variant="rectangular" />
      </Grid>
      <Grid item xs={6} sx={{marginTop: '20px'}}>
        <Skeleton sx={{ height: 150, width: 125, marginLeft: "20px", marginTop: "17px" }} animation="wave"
                  variant="rectangular" />
      </Grid>
      <Grid item xs={6} sx={{marginTop: '20px'}}>
        <Skeleton sx={{ height: 150, width: 125, marginLeft: "10px", marginTop: "17px" }} animation="wave"
                  variant="rectangular" />
      </Grid>
      <Grid item xs={6} sx={{marginTop: '20px'}}>
        <Skeleton sx={{ height: 150, width: 125, marginLeft: "20px", marginTop: "17px" }} animation="wave"
                  variant="rectangular" />
      </Grid>
    </Grid>
  );
};

export default SearchResultsMobileLoading;