import React, { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MediaClient from "../client/MediaClient";
import WishlistClient from "../client/WishlistClient";
import { Container, Typography } from "@mui/material";
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
import RatingClient from "../client/RatingClient";
import Avatar from "@mui/material/Avatar";
import moment from "moment/moment";
import LoginErrorModal from "../shared/errorModals/LoginErrorModal";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MediaInfoDesktopLoading from "../shared/loading/MediaInfoDesktopLoading";
import MediaInfoMobileLoading from "../shared/loading/MediaInfoMobileLoading";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";
import { useQuery } from "@tanstack/react-query";

const MediaInfo = () => {
  const { id, mediaType } = useParams();
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const navigate = useNavigate();

  const { isLoading, data: mediaInfo } = useQuery({
    queryKey: ["mediaInfoDetails", { mediaType, id }],
    queryFn: async () => await MediaClient.getMediaInfoDetails(mediaType, id),
    staleTime: 60000,
    select: ({ data }) => data.data.media,
  });

  const { data: ratingsList } = useQuery({
    queryKey: ["ratingsForMedia", { mediaType: mediaType, id: id }],
    queryFn: async () => await RatingClient.getAllRatingsForMedia(id),
    staleTime: 60000,
    select: ({ data }) => data.data.ratingsList,
  });

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
    requestBody.mediaId = mediaInfo.mediaId;
    requestBody.userName = currentUser.userName;
    await WishlistClient.addToWishlist(requestBody);
  };

  const displayMovieTvShow = (mediaInfo) => (
    <>
      <Grid item xs={12}>
        <Typography
          sx={{
            marginTop: "10px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {mediaInfo.name}
        </Typography>
        <div>
          <Typography>{mediaInfo.description}</Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <List component="nav">
          <Divider />
          {mediaInfo.director && mediaInfo.director.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography>
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Directors:{" "}
                </span>
                {listToString(mediaInfo.director)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {mediaInfo.producer && mediaInfo.producer.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography>
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Producers:{" "}
                </span>
                {listToString(mediaInfo.producer)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {mediaInfo.cast && mediaInfo.cast.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography>
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Cast:{" "}
                </span>
                {listToString(mediaInfo.cast)}
              </Typography>
            </ListItem>
          )}
          <Divider />
        </List>
      </Grid>
    </>
  );

  const displayBook = (mediaInfo) => (
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
          {mediaInfo.name}
        </Typography>
        <div>
          <Typography component="div">{mediaInfo.description}</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <List component="nav">
          <Divider />
          {mediaInfo.author && mediaInfo.author.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Authors:{" "}
                </span>
                {listToString(mediaInfo.author)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {mediaInfo.genre && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Genre:{" "}
                </span>
                <span style={{ fontWeight: "400", fontSize: "16px" }}>
                  {mediaInfo.genre}
                </span>
              </Typography>
            </ListItem>
          )}
          <Divider />
        </List>
      </Grid>
    </>
  );

  const displayMusic = (mediaInfo) => (
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
          {mediaInfo.name}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <List component="nav">
          <Divider />
          {mediaInfo.album && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Album:{" "}
                </span>
                {mediaInfo.album}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {mediaInfo.artist && mediaInfo.artist.length > 0 && (
            <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Artists:{" "}
                </span>
                {listToString(mediaInfo.artist)}
              </Typography>
            </ListItem>
          )}
          <Divider />
        </List>
      </Grid>
    </>
  );

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    return "" + timeAgo.split(" ")[0] + units[0];
  };

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginTop: "50px", marginBottom: "25px" }}
      >
        <Box>
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "17px",
              padding: "35px",
            }}
          >
            <PrimaryButton
              variant="text"
              leftIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
              onClick={() => navigate(-1)}
            >
              Return
            </PrimaryButton>
            {isLoading ? (
              <MediaInfoMobileLoading />
            ) : (
              mediaInfo && (
                <Grid
                  container
                  spacing={{ xs: 2, md: 2, xl: 5 }}
                  columns={{ md: 12 }}
                  sx={{ paddingTop: "20px" }}
                >
                  <Grid item xs={12} container justifyContent="center">
                    <img
                      width="80%"
                      height="100%"
                      alt="poster"
                      style={{ margin: "auto", borderRadius: 7 }}
                      src={
                        mediaInfo.picture ? mediaInfo.picture : NotFoundImage
                      }
                    />
                  </Grid>
                  <Grid item xs={12} container justifyContent="center">
                    <PrimaryButton
                      variant="contained"
                      leftIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
                      onClick={handleAddRatingModalOpen}
                    >
                      Add Rating
                    </PrimaryButton>
                  </Grid>
                  <Grid item xs={12} container justifyContent="center">
                    <PrimaryButton
                      variant="text"
                      leftIcon={
                        <PlaylistAddIcon style={{ color: "#00a8ff" }} />
                      }
                      onClick={handleAddToWishlist}
                    >
                      Add to Wishlist
                    </PrimaryButton>
                  </Grid>
                  {(mediaInfo.mediaType === "MOVIE" ||
                    mediaInfo.mediaType === "TV") &&
                    displayMovieTvShow(mediaInfo)}
                  {mediaInfo.mediaType === "MUSIC" && displayMusic(mediaInfo)}
                  {mediaInfo.mediaType === "BOOK" && displayBook(mediaInfo)}
                </Grid>
              )
            )}
          </Paper>
        </Box>
        {ratingsList && ratingsList.length > 0 && (
          <Box sx={{ marginTop: "15px" }}>
            <Paper
              elevation={6}
              sx={{
                backgroundColor: "#FFFFFF",
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
                          margin: "0 10px",
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
          mediaDetails={mediaInfo}
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
    </Box>
  );
};

export default MediaInfo;
