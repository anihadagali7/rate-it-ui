import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Provider, useAtom } from "jotai";
import { theme } from "../styles/Theme";
import MediaClient from "../client/MediaClient";
import WishlistClient from "../client/WishlistClient";
import {
  Container,
  StyledEngineProvider,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import NotFoundImage from "../imgs/Image-Not-Available.jpeg";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import StarIcon from "@mui/icons-material/Star";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddRatingModal from "../components/modals/AddRatingModal";
import { currentUser } from "../state/user";
import RatingClient from "../client/RatingClient";
import Avatar from "@mui/material/Avatar";
import moment from "moment/moment";
import LoginErrorModal from "../shared/errorModals/LoginErrorModal";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MediaInfoDesktopLoading from "../shared/loading/MediaInfoDesktopLoading";
import MediaInfoMobileLoading from "../shared/loading/MediaInfoMobileLoading";
import PrimaryButton from "../shared/buttons/PrimaryButton";

const MediaInfo = () => {
  const { id, mediaType } = useParams();
  const [media, setMedia] = useState({});
  const [ratingsList, setRatingsList] = useState([]);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [user, setUser] = useAtom(currentUser);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const [ratingAdded, setRatingAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMediaInfoDetails(mediaType, id);
  }, [id, mediaType]);

  useEffect(() => {
    getRatingsForMedia(id);
  }, [ratingAdded]);

  const getRatingsForMedia = async (id) => {
    const result = await RatingClient.getAllRatingsForMedia(
      id,
      setDisplayTokenModal
    );
    setRatingsList(result.data.ratingsList);
  };

  const getMediaInfoDetails = async (mediaType, id) => {
    setLoading(true);
    const result = await MediaClient.getMediaInfoDetails(mediaType, id);
    setMedia(result.data.media);
    setLoading(false);
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

  const handleAddToWishlist = async () => {
    let requestBody = {};
    requestBody.mediaId = media.mediaId;
    requestBody.userName = user.userName;
    await WishlistClient.addToWishlist(requestBody);
  };

  const displayMovieTvShow = (media) => (
    <>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Typography
          component="div"
          sx={{
            marginTop: "10px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {media.name}
        </Typography>
        <div>
          <Typography component="div">{media.description}</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <List component="nav">
          <Divider />
          {media.director && media.director.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
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

  const displayBook = (media) => (
    <>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Typography
          component="div"
          sx={{
            marginTop: "10px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {media.name}
        </Typography>
        <div>
          <Typography component="div">{media.description}</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <List component="nav">
          <Divider />
          {media.author && media.author.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Authors:{" "}
                </span>
                {listToString(media.author)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {media.genre && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Genre:{" "}
                </span>
                <span style={{ fontWeight: "400", fontSize: "16px" }}>
                  {media.genre}
                </span>
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
            fontWeight: "bold",
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
          <PrimaryButton
            variant="contained"
            leftIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
            onClick={handleAddRatingModalOpen}
          >
            Add Rating
          </PrimaryButton>
          <PrimaryButton
            variant="contained"
            leftIcon={<PlaylistAddIcon style={{ color: "#00a8ff" }} />}
            onClick={handleAddToWishlist}
          >
            Add to Wishlist
          </PrimaryButton>
        </Stack>
      </Grid>
      {(media.mediaType === "MOVIE" || media.mediaType === "TV") &&
        displayMovieTvShow(media)}
      {media.mediaType === "MUSIC" && displayMusic(media)}
      {media.mediaType === "BOOK" && displayBook(media)}
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
        <PrimaryButton
          variant="contained"
          leftIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
          onClick={handleAddRatingModalOpen}
        >
          Add Rating
        </PrimaryButton>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <PrimaryButton
          variant="contained"
          leftIcon={<PlaylistAddIcon style={{ color: "#00a8ff" }} />}
          onClick={handleAddToWishlist}
        >
          Add to Wishlist
        </PrimaryButton>
      </Grid>
      {(media.mediaType === "MOVIE" || media.mediaType === "TV") &&
        displayMovieTvShow(media)}
      {media.mediaType === "MUSIC" && displayMusic(media)}
      {media.mediaType === "BOOK" && displayBook(media)}
    </Grid>
  );

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    return "" + timeAgo.split(" ")[0] + units[0];
  };

  return (
    <Provider>
      <Container
        maxWidth={"sm"}
        sx={{ marginTop: "50px", marginBottom: "25px" }}
      >
        <PrimaryButton
          variant="text"
          leftIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
          onClick={() => navigate(-1)}
        >
          Return
        </PrimaryButton>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            margin: "auto",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#FFFFFF",
              margin: "auto",
              borderRadius: "17px",
            }}
          >
            <div style={{ padding: "0 35px", minHeight: "385px" }}>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                {loading ? (
                  <MediaInfoMobileLoading />
                ) : (
                  media && mobileView(media)
                )}
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {loading ? (
                  <MediaInfoDesktopLoading />
                ) : (
                  media && desktopView(media)
                )}
              </Box>
            </div>
          </Paper>
        </Box>
        {ratingsList && ratingsList.length > 0 && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              margin: "auto",
              marginTop: "15px",
            }}
          >
            <Paper
              elevation={6}
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                margin: "auto",
                borderRadius: "17px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "22px",
                  paddingTop: "15px",
                  paddingLeft: "25px",
                }}
              >
                User reviews
              </Typography>
              <List
                component="nav"
                sx={{ marginLeft: "15px", marginRight: "15px" }}
              >
                {ratingsList &&
                  ratingsList.length > 0 &&
                  ratingsList.map((rating) => (
                    <>
                      <ListItem>
                        <Stack direction="row" spacing={2}>
                          <>
                            <Avatar
                              sx={{
                                bgcolor: "#00a8ff",
                                textDecoration: "none",
                                marginTop: "auto",
                                marginBottom: "auto",
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
                                  {rating.ratedBy.firstName}{" "}
                                  {rating.ratedBy.lastName}
                                  <span style={{ fontWeight: "normal" }}>
                                    {" "}
                                    @{rating.ratedBy.userName}
                                  </span>
                                  <span style={{ fontWeight: "normal" }}>
                                    {" "}
                                    &#8226; {getTimeAgo(rating.dateCreated)}
                                  </span>
                                </span>
                                <span>
                                  <Typography
                                    component={Link}
                                    sx={{ textDecoration: "none" }}
                                    to={`/${rating.media.mediaType}/${rating.media.mediaId}`}
                                  >
                                    -{rating.media.name}
                                  </Typography>
                                </span>
                                <Typography>Rating: {rating.rating}</Typography>
                                <Typography>
                                  Comments: {rating.comments}
                                </Typography>
                              </Stack>
                            </div>
                          </>
                        </Stack>
                      </ListItem>
                      <Divider
                        sx={{
                          width: "95%",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                    </>
                  ))}
              </List>
            </Paper>
          </Box>
        )}
      </Container>
      {openRatingModal && (
        <AddRatingModal
          open={openRatingModal}
          onClose={handleAddRatingModalClose}
          mediaDetails={media}
          user={user}
          ratingAdded={ratingAdded}
          setRatingAdded={setRatingAdded}
        />
      )}
      {displayTokenModal && (
        <LoginErrorModal
          open={displayTokenModal}
          onClose={() => {
            setDisplayTokenModal(false);
          }}
        />
      )}
    </Provider>
  );
};

export default MediaInfo;
