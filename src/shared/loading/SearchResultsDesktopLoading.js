import React from "react";
import { Card, Container, Grid, Skeleton } from "@mui/material";

const SearchResultsDesktopLoading = () => {
  return (
    <Container maxWidth={"sm"}>
      <Card sx={{ maxWidth: 500, m: 2 }}>
        <Grid container>
          <Grid item xs={4}>
            <Skeleton sx={{ height: 150, width: 100, marginLeft: '20px', marginTop: '17px' }} animation="wave" variant="rectangular" />
          </Grid>
          <Grid item xs={8}>
            <Skeleton animation="wave" height={20} width="40%" sx={{marginTop: '13px'}}/>
            <Skeleton animation="wave" height={160} width="70%"  />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default SearchResultsDesktopLoading;