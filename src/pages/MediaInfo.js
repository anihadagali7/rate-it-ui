import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Provider, useAtom } from "jotai";
import { theme } from "../Theme/Theme";
import MediaClient from "../client/MediaClient";
import {
  Container,
  StyledEngineProvider,
  ThemeProvider,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import NotFoundImage from "../imgs/Image-Not-Available.jpeg";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddRatingModal from "../components/modals/AddRatingModal";
import { currentUser } from "../state/user";
import RatingClient from "../client/RatingClient";
import Avatar from "@mui/material/Avatar";
import moment from "moment/moment";

const MediaInfo = () => {
  const { id, mediaType } = useParams();
  const [media, setMedia] = useState({});
  const [ratingsList, setRatingsList] = useState([]);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [user, setUser] = useAtom(currentUser);

  useEffect(() => {
    getMediaInfoDetails(mediaType, id);
    getRatingsForMedia(id);
  }, [id, mediaType]);

  const getRatingsForMedia = async (id) => {
    const result = await RatingClient.getAllRatingsForMedia(id);
    setRatingsList(result.data.ratingsList);
  };

  const getMediaInfoDetails = async (mediaType, id) => {
    const result = await MediaClient.getMediaInfoDetails(mediaType, id);
    setMedia(result.data.media);
  };

  const listToString = (list) => {
    let newString = "";

    list.forEach((name) => {
      newString += name + ", ";
    });

    return newString.substring(0, newString.length - 2);
  };

  const handleAddRatingModalOpen = () => {
    setOpenRatingModal(true);
  };

  const handleAddRatingModalClose = () => {
    setOpenRatingModal(false);
  };

  const displayMovieTvShow = (media) => (
    <>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Typography
          component="div"
          variant="header"
          sx={{
            marginTop: "10px",
          }}
        >
          {media.name}
        </Typography>
        <div>
          <Typography component="div" variant="normalText" >{media.description}</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <List component="nav">
          <Divider />
          {media.director && media.director.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px", fontFamily: "" }}>
                  Directors:{" "}
                </span>
                {listToString(media.director)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {media.producer && media.producer.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Producers:{" "}
                </span>
                {listToString(media.producer)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {media.cast && media.cast.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Cast:{" "}
                </span>
                {listToString(media.cast)}
              </Typography>
            </ListItem>
          )}
          <Divider />
        </List>
      </Grid>
    </>
  );

  const displayMusic = (media) => (
    <>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Typography
          component="div"
          sx={{
            marginTop: "10px",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          {media.name}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <List component="nav">
          <Divider />
          {media.album && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Album:{" "}
                </span>
                {media.album}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {media.artist && media.artist.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Artists:{" "}
                </span>
                {listToString(media.artist)}
              </Typography>
            </ListItem>
          )}
          <Divider />
        </List>
      </Grid>
    </>
  );

  const desktopView = (media) => (
    <Grid container spacing={{ xs: 2, md: 2, xl: 5 }} columns={{ md: 12 }}>
      <Grid item xs={6}>
        <Typography>
          <img
            width={200}
            height={250}
            style={{ margin: "10px 0" }}
            alt="poster"
            src={media.picture ? media.picture : NotFoundImage}
          />
        </Typography>
      </Grid>
      <Grid item xs={6} align="center" justify="center" direction="column">
        <Stack spacing={4} sx={{ marginTop: "80px" }}>
          <Button
            variant="outlined"
            startIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
            sx={{
              border: "transparent",
              backgroundColor: "#00a8ff",
              borderRadius: "17px",
              "&.MuiButtonBase-root:hover": {
                border: "transparent",
                backgroundColor: "#00a8ff"
              }
            }}
            onClick={handleAddRatingModalOpen}
          >
            <Typography variant="normalTextWhite">Add Rating</Typography>
          </Button>
          <Button
            variant="outlined"
            startIcon={<PlaylistAddIcon style={{ color: "#FFFFFF" }} />}
            sx={{
              border: "transparent",
              backgroundColor: "#00a8ff",
              borderRadius: "17px",
              "&.MuiButtonBase-root:hover": {
                border: "transparent",
                backgroundColor: "#00a8ff"
              }
            }}
          >
            <Typography variant="normalTextWhite">Add to Playlist</Typography>
          </Button>
        </Stack>
      </Grid>
      {(media.mediaType === "MOVIE" || media.mediaType === "TV") &&
        displayMovieTvShow(media)}
      {media.mediaType === "MUSIC" && displayMusic(media)}
    </Grid>
  );

  const mobileView = (media) => (
    <Grid container spacing={{ xs: 2, md: 2, xl: 5 }} columns={{ md: 12 }}>
      <Grid item xs={12} sx={{ margin: "auto" }}>
        <Typography>
          <img
            width={200}
            height={250}
            style={{ margin: "10px 0" }}
            alt="poster"
            src={media.picture ? media.picture : NotFoundImage}
          />
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Button
          variant="outlined"
          startIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
          sx={{
            border: "transparent",
            backgroundColor: "#00a8ff",
            width: "100%",
            borderRadius: "17px",
            "&.MuiButtonBase-root:hover": {
              border: "transparent",
              backgroundColor: "#00a8ff"
            }
          }}
          onClick={handleAddRatingModalOpen}
        >
          <Typography variant="normalTextWhite">Add Rating</Typography>
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Button
          variant="outlined"
          startIcon={<PlaylistAddIcon style={{ color: "#00a8ff" }} />}
          sx={{
            border: "transparent",
            backgroundColor: "#ffffff",
            borderRadius: "17px",
            width: "100%",
            "&.MuiButtonBase-root:hover": {
              border: "transparent",
              backgroundColor: "#ffffff"
            }
          }}
        >
          <Typography variant="normalTextWhite" sx={{ color: "#00a8ff" }}>
            Add to Playlist
          </Typography>
        </Button>
      </Grid>
      {(media.mediaType === "MOVIE" || media.mediaType === "TV") &&
        displayMovieTvShow(media)}
      {media.mediaType === "MUSIC" && displayMusic(media)}
    </Grid>
  );

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    return "" + timeAgo.split(" ")[0] + units[0];
  };

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container
            maxWidth={"sm"}
            sx={{ marginTop: "50px", marginBottom: "25px" }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                margin: "auto"
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  borderRadius: "17px"
                }}
              >
                <div style={{ padding: "0 35px", minHeight: "385px" }}>
                  <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                    {mobileView(media)}
                  </Box>
                  <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                    {desktopView(media)}
                  </Box>
                </div>
              </Paper>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                margin: "auto",
                marginTop: "15px"
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  borderRadius: "17px"
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "22px",
                    paddingTop: "15px",
                    paddingLeft: "25px"
                  }}
                >
                  User reviews
                </Typography>
                <List component="nav" sx={{marginLeft: '15px', marginRight: '15px'}}>
                  {ratingsList && ratingsList.length > 0 && ratingsList.map((rating) => (
                    <>
                      <ListItem>
                        <Stack
                          direction="row"
                          spacing={2}
                        >
                          <>
                            <Avatar
                              sx={{
                                bgcolor: "#00a8ff",
                                textDecoration: "none",
                                marginTop: "auto",
                                marginBottom: "auto"
                              }}
                              component={Link}
                              to={`/profile/${rating.ratedBy.userName}`}
                            >
                              {rating.ratedBy.firstName[0]}
                              {rating.ratedBy.lastName[0]}
                            </Avatar>
                            <div>
                              <Stack direction="column">
                                <span style={{ fontWeight: "bold" }}>
                                  {rating.ratedBy.firstName} {rating.ratedBy.lastName}
                                  <span style={{ fontWeight: "normal" }}> @{rating.ratedBy.userName}</span>
                                <span style={{ fontWeight: "normal" }}> &#8226; {getTimeAgo(rating.dateCreated)}</span>
                                </span>
                                <span>
                                  <Typography component={Link} sx={{ textDecoration: "none" }}
                                              to={`/${rating.media.mediaType}/${rating.media.mediaId}`}>
                                   -{rating.media.name}
                                </Typography>
                              </span>
                                <Typography>Rating: {rating.rating}</Typography>
                                <Typography>Comments: {rating.comments}</Typography>
                              </Stack>
                            </div>
                          </>
                        </Stack>
                      </ListItem>
                      <Divider sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }} />
                    </>
                  ))}
                </List>
              </Paper>
            </Box>
          </Container>
          {openRatingModal && (
            <AddRatingModal open={openRatingModal} onClose={handleAddRatingModalClose} mediaDetails={media}
                            user={user} />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default MediaInfo;
