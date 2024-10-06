import {
  Container,
  Grid,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { Provider, useAtom } from "jotai";
import React, { useState } from "react";
import { theme } from "../../Theme/Theme";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import { Link } from "react-router-dom";
import UserClient from "../../client/UserClient";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { currentUser } from "../../state/user";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const SearchResultsMobile = ({ results, resultType }) => {
  const [updateList, setUpdateList] = useState(false);
  const [user, setUser] = useAtom(currentUser);

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

  const determineActionButton = (profile) => {
    if (profile.userName === user.userName) {
      return <></>;
    } else if (
      profile &&
      profile.followers &&
      profile.followers.includes(user && user.userName)
    ) {
      return (
        <PrimaryButton
          variant="contained"
          onClick={() => unFollowUser(user.userName, profile.userName)}
        >
          Following
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          variant="contained"
          onClick={() => followUser(user.userName, profile.userName)}
        >
          Follow
        </PrimaryButton>
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
          <Stack direction="row" spacing={2}>
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
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  margin: "0 0 50px 0",
                }}
              >
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
        <ThemeProvider theme={theme}>
          <Divider sx={{ marginTop: "30px" }} />
          <Container
            maxWidth={"sm"}
            sx={{
              "&.MuiContainer-root": {
                marginLeft: "-23px !important",
                paddingRight: "0px !important",
              },
            }}
          >
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
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default SearchResultsMobile;
