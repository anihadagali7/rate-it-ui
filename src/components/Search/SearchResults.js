import { Button, Container, Grid, Paper, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { Provider, useAtom } from "jotai";
import React, { useState } from "react";
import { theme } from "../../Theme/Theme";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import UserClient from "../../client/UserClient";
import { currentUser } from "../../state/user";

const SearchResults = ({ results, resultType }) => {

  const [updateList, setUpdateList] = useState(false);
  const [user, setUser] = useAtom(currentUser);

  const listItem = (row) => (
    <ListItem
      component={Link}
      to={`/${resultType}/${row.mediaId}`}
      sx={{
        width: 525,
        "&.MuiListItem-root": { marginLeft: "-12px" }
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: 500,
            borderRadius: "17px"
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
                "&.MuiGrid-root": { marginLeft: "-16px !important" }
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
                marginRight: "50px"
              }}
            >
              <div style={{ marginLeft: "40px", width: "100%" }}>
                <Typography
                  component="div"
                  sx={{
                    marginTop: "10px",
                    fontSize: "18px",
                    fontWeight: "bold"
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
          "&.MuiListItem-root": { marginLeft: "-12px" }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "17px"
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
                  "&.MuiGrid-root": { marginLeft: "-16px !important" }
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
                  marginRight: "50px"
                }}
              >
                <div style={{ marginLeft: "40px", width: "100%" }}>
                  <Typography
                    component="div"
                    sx={{
                      marginTop: "10px",
                      fontSize: "18px",
                      fontWeight: "bold"
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

  const determineActionButton = (profile) => {
    if (profile.userName === user.userName) {
      return (
        <></>
      );
    } else if (profile && profile.followers && profile.followers.includes(user && user.userName)) {
      return (
        <Button
          variant="outlined"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%"
          }}
          onClick={() => unFollowUser(user.userName, profile.userName)}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#00a8ff",
                        fontWeight: "bold"
                      }}
          >
            Following
          </Typography>
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            borderRadius: "17px",
            marginTop: "20px",
            marginRight: "3px",
            width: "100%",
            backgroundColor: "#00a8ff"
          }}
          onClick={() => followUser(user.userName, profile.userName)}
        >
          <Typography component="div"
                      sx={{
                        fontSize: "12px",
                        color: "#ffffff",
                        fontWeight: "bold"
                      }}
          >
            Follow
          </Typography>
        </Button>
      );
    }
  };

  const unFollowUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.unFollowUser(currentUser, userToUnfollow);
    result == 200 && setUpdateList(!updateList);
  };

  const followUser = async (currentUser, userToUnfollow) => {
    let result = await UserClient.followUser(currentUser, userToUnfollow);
    result == 200 && setUpdateList(!updateList);
  };

  const listItemUser = (profile) => {
    return (
      <>
        <ListItem>
          <Stack
            direction="row"
            spacing={2}
          >
            <>
              <Avatar
                sx={{ bgcolor: "#00a8ff", textDecoration: "none" }}
                component={Link}
                to={`/profile/${profile.userName}`}
              >
                {profile.firstName[0]}
                {profile.lastName[0]}
              </Avatar>
              <div>
                <Stack direction="column">
                  <Typography sx={{ fontWeight: "bold" }}>
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography>@{profile.userName}</Typography>
                </Stack>
              </div>
              <div style={{
                position: "absolute",
                right: "10px",
                margin: "0 0 50px 0"
              }}>
                {/*{determineActionButton(profile)}*/}
              </div>
            </>
          </Stack>
        </ListItem>
        <Divider />
      </>
    );
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}></ThemeProvider>
        <Divider sx={{ marginTop: "30px" }} />
        <Container
          maxWidth={"sm"}
          sx={{ "&.MuiContainer-root": { marginLeft: "-37px !important" } }}
        >
          <List sx={{ width: "100%", maxWidth: 360 }}>
            {resultType === "music" &&
              results.map((row, index) => listItemMusic(row))}
            {(resultType === "movie" || resultType === "tv") &&
              results.map((row, index) => listItem(row))}
            {(resultType === "user") &&
              results.map((row, index) => listItemUser(row))}
          </List>
        </Container>
      </StyledEngineProvider>
    </Provider>
  );
};

export default SearchResults;
