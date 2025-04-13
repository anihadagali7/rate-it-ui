import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import ProfileCard from "../profilecard/ProfileCard";

const SearchResults = ({ results, resultType, handleSearch }) => {
  const listItem = (row) => (
    <ListItem component={Link} to={`/${resultType}/${row.mediaId}`}>
      {/* <Card sx={{ display: "flex", width: "100%" }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={row.poster ? row.poster : NotFoundImage}
          alt="Live from space album cover"
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {row.name.length > 25
                ? `${row.name.substring(0, 25)}...`
                : row.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {row.description.length > 100
                ? `${row.description.substring(0, 100)}...`
                : row.description}
            </Typography>
          </CardContent>
        </Box>
      </Card> */}
      <div className="card bg-gray-100 shadow-sm">
        <figure>
          <img src={row.poster ? row.poster : NotFoundImage} alt="poster" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {row.name.length > 25
              ? `${row.name.substring(0, 25)}...`
              : row.name}
          </h2>
          <p>
            {row.description.length > 100
              ? `${row.description.substring(0, 100)}...`
              : row.description}
          </p>
        </div>
      </div>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: 500,
            borderRadius: "17px",
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 2, xl: 2 }}
            columns={{ md: 12 }}
            sx={{ "&.MuiGrid-root": { marginLeft: "16px" } }}
          >
            <Grid
              item
              xs={2}
              sx={{
                "&.MuiGrid-root": { marginLeft: "-16px !important" },
              }}
            >
              <div>
                <ListItemAvatar sx={{ marginTop: "15px" }}>
                  <img
                    width={100}
                    height={150}
                    style={{ marginBottom: "10px" }}
                    alt="poster"
                    src={row.poster ? row.poster : NotFoundImage}
                  />
                </ListItemAvatar>
              </div>
            </Grid>
            <Grid
              item
              xs={7}
              sx={{
                marginTop: "0px",
                marginRight: "50px",
              }}
            >
              <div style={{ marginLeft: "40px", width: "100%" }}>
                <Typography
                  component="div"
                  sx={{
                    marginTop: "10px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {row.name.length > 25
                    ? `${row.name.substring(0, 25)}...`
                    : row.name}
                </Typography>
                <Typography component="div">
                  {row.description.length > 100
                    ? `${row.description.substring(0, 100)}...`
                    : row.description}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Box> */}
    </ListItem>
  );

  const listItemBook = (row) => (
    <ListItem
      component={Link}
      to={`/${resultType}/${row.mediaId}`}
      sx={{
        width: 525,
        "&.MuiListItem-root": { marginLeft: "-12px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: 500,
            borderRadius: "17px",
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 2, xl: 2 }}
            columns={{ md: 12 }}
            sx={{ "&.MuiGrid-root": { marginLeft: "16px" } }}
          >
            <Grid
              item
              xs={2}
              sx={{
                "&.MuiGrid-root": { marginLeft: "-16px !important" },
              }}
            >
              <div>
                <ListItemAvatar sx={{ marginTop: "15px" }}>
                  <img
                    width={100}
                    height={150}
                    style={{ marginBottom: "10px" }}
                    alt="poster"
                    src={row?.poster ? row.poster : NotFoundImage}
                  />
                </ListItemAvatar>
              </div>
            </Grid>
            <Grid
              item
              xs={7}
              sx={{
                marginTop: "0px",
                marginRight: "50px",
              }}
            >
              <div style={{ marginLeft: "40px", width: "100%" }}>
                <Typography
                  component="div"
                  sx={{
                    marginTop: "10px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {row?.name?.length > 25
                    ? `${row?.name?.substring(0, 25)}...`
                    : row?.name}
                </Typography>
                <Typography
                  component="div"
                  sx={{ fontSize: "15px", fontStyle: "italic" }}
                >
                  {row?.author?.length > 25
                    ? `${row?.author?.substring(0, 25)}...`
                    : row?.author}
                </Typography>
                <Typography component="div">
                  {row?.description?.length > 75
                    ? `${row?.description?.substring(0, 75)}...`
                    : row?.description}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ListItem>
  );

  const listItemMusic = (row) => {
    return (
      <ListItem
        component={Link}
        to={`/${resultType}/${row.mediaId}`}
        sx={{
          width: 700,
          "&.MuiListItem-root": { marginLeft: "-12px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "17px",
          }}
        >
          <Paper elevation={8} sx={{ width: 500, borderRadius: "17px" }}>
            <Grid
              container
              spacing={{ xs: 2, md: 2, xl: 2 }}
              columns={{ md: 12 }}
              sx={{ "&.MuiGrid-root": { marginLeft: "16px" } }}
            >
              <Grid
                item
                xs={3}
                sx={{
                  "&.MuiGrid-root": { marginLeft: "-16px !important" },
                }}
              >
                <div>
                  <ListItemAvatar sx={{ marginTop: "15px" }}>
                    <img
                      width={150}
                      height={150}
                      style={{ marginBottom: "10px" }}
                      alt="poster"
                      src={row.poster ? row.poster : NotFoundImage}
                    />
                  </ListItemAvatar>
                </div>
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  marginTop: "0px",
                  marginRight: "50px",
                }}
              >
                <div style={{ marginLeft: "40px", width: "100%" }}>
                  <Typography
                    component="div"
                    sx={{
                      marginTop: "10px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {row.name}{" "}
                    {row.albumType === "album" && ", " + row.albumName}
                  </Typography>
                  <Typography component="div">
                    {row.artists.length > 100
                      ? `${row.artists.substring(0, 100)}...`
                      : row.artists}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </ListItem>
    );
  };

  const listItemUser = (profile) => {
    return <ProfileCard profile={profile} reSearch={() => handleSearch()} />;
  };

  return (
    <Container>
      <List>
        {resultType === "music" &&
          results.map((row, index) => listItemMusic(row))}
        {resultType === "book" &&
          results.map((row, index) => listItemBook(row))}
        {(resultType === "movie" || resultType === "tv") &&
          results.map((row, index) => listItem(row))}
        {resultType === "user" &&
          results.map((row, index) => listItemUser(row))}
      </List>
    </Container>
  );
};

export default SearchResults;
