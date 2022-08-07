import React from "react";
import { Card, Grid, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";

const SearchResultsDesktopLoading = () => {
  return (
      <Card sx={{ "&.MuiCard-root": { width: '100%' }, "&.MuiPaper-root": { width: '100%' }, marginTop: '30px' }}>
        <Grid container>
          <Grid item xs={4}>
            <Skeleton sx={{ height: 150, width: 100, marginLeft: '20px', marginTop: '17px' }} animation="wave" variant="rectangular" />
          </Grid>
          <Grid item xs={8}>
            <Skeleton animation="wave" height={20} width="40%" sx={{marginTop: '13px'}}/>
            <Skeleton animation="wave" height={160} width="70%"  />
          </Grid>
        </Grid>
        <Divider />
        <Grid container>
          <Grid item xs={4}>
            <Skeleton sx={{ height: 150, width: 100, marginLeft: '20px', marginTop: '17px' }} animation="wave" variant="rectangular" />
          </Grid>
          <Grid item xs={8}>
            <Skeleton animation="wave" height={20} width="40%" sx={{marginTop: '13px'}}/>
            <Skeleton animation="wave" height={160} width="70%"  />
          </Grid>
        </Grid>
        <Divider />
        <Grid container>
          <Grid item xs={4}>
            <Skeleton sx={{ height: 150, width: 100, marginLeft: '20px', marginTop: '17px' }} animation="wave" variant="rectangular" />
          </Grid>
          <Grid item xs={8}>
            <Skeleton animation="wave" height={20} width="40%" sx={{marginTop: '13px'}}/>
            <Skeleton animation="wave" height={160} width="70%"  />
          </Grid>
        </Grid>
        <Divider />
        <Grid container>
          <Grid item xs={4}>
            <Skeleton sx={{ height: 150, width: 100, marginLeft: '20px', marginTop: '17px' }} animation="wave" variant="rectangular" />
          </Grid>
          <Grid item xs={8}>
            <Skeleton animation="wave" height={20} width="40%" sx={{marginTop: '13px'}}/>
            <Skeleton animation="wave" height={160} width="70%"  />
          </Grid>
        </Grid>
        <Divider />
        <Grid container>
          <Grid item xs={4}>
            <Skeleton sx={{ height: 150, width: 100, marginLeft: '20px', marginTop: '17px' }} animation="wave" variant="rectangular" />
          </Grid>
          <Grid item xs={8}>
            <Skeleton animation="wave" height={20} width="40%" sx={{marginTop: '13px'}}/>
            <Skeleton animation="wave" height={160} width="70%"  />
          </Grid>
        </Grid>
        <Divider />
      </Card>
  );
}

export default SearchResultsDesktopLoading;