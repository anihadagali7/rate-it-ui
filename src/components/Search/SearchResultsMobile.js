import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import ProfileCard from "../profilecard/ProfileCard";

const SearchResultsMobile = ({ results, resultType, handleSearch }) => {
  const listItem = (row, index) => (
    <Grid
      item
      xs={6}
      sx={{ paddingLeft: index % 2 == 0 ? "0px" : "20px" }}
      component={Link}
      to={`/${resultType}/${row.mediaId}`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div>
          <ListItemAvatar sx={{ marginTop: "15px" }}>
            <img
              width={150}
              height={200}
              style={{ marginBottom: "10px" }}
              alt="poster"
              src={row.poster ? row.poster : NotFoundImage}
            />
          </ListItemAvatar>
        </div>
      </Box>
    </Grid>
  );

  const listItemBook = (row, index) => (
    <Grid
      item
      xs={6}
      sx={{
        paddingLeft: index % 2 == 0 ? "0px" : "20px",
        textDecoration: "none",
      }}
      component={Link}
      to={`/${resultType}/${row.mediaId}`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div>
          <Typography
            component="div"
            sx={{
              marginTop: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              paddingLeft: index % 2 == 0 ? "5px" : "10px",
              paddingBottom: "5px",
              maxHeight: "20px",
              color: "#000000",
            }}
          >
            {row.name}
          </Typography>
          <ListItemAvatar sx={{ marginTop: "15px" }}>
            <img
              width={150}
              height={175}
              style={{ marginBottom: "10px" }}
              alt="poster"
              src={row.poster ? row.poster : NotFoundImage}
            />
          </ListItemAvatar>
        </div>
      </Box>
    </Grid>
  );

  const listItemMusic = (row, index) => (
    <Grid
      item
      xs={6}
      sx={{
        paddingLeft: index % 2 == 0 ? "0px" : "20px",
        textDecoration: "none",
      }}
      component={Link}
      to={`/${resultType}/${row.mediaId}`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div>
          <Typography
            component="div"
            sx={{
              marginTop: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              paddingLeft: index % 2 == 0 ? "5px" : "10px",
              paddingBottom: "5px",
              maxHeight: "20px",
              color: "#000000",
            }}
          >
            {row.name}
          </Typography>
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
      </Box>
    </Grid>
  );

  const listItemUser = (profile) => {
    return (
      <ProfileCard
        profile={profile}
        reSearch={() => handleSearch()}
      />
    );
  };

  return (
    <>
      <Divider sx={{ marginTop: "30px" }} />
      <Grid container>
        {resultType === "music" &&
          results.map((row, index) => listItemMusic(row, index))}
        {(resultType === "movie" || resultType === "tv") &&
          results.map((row, index) => listItem(row, index))}
        {resultType === "user" &&
          results.map((row, index) => listItemUser(row))}
        {resultType === "book" &&
          results.map((row, index) => listItemBook(row))}
      </Grid>
    </>
  );
};

export default SearchResultsMobile;
