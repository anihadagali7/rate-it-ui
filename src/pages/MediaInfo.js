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
import MediaInfoMobileLoading from "../shared/loading/MediaInfoMobileLoading";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import { useMediaQuery, useTheme } from "@mui/material";
import MobilePlaylistDrawer from "./../components/mediainfo/MobilePlaylistDrawer";
import DesktopPlaylistDialog from "./../components/mediainfo/DesktopPlaylistDialog";

const mediaTypeConfig = {
  movie: [
    { label: "Description", dataKey: "description", displayLabel: false },
    { label: "Director", dataKey: "director", displayLabel: true },
    { label: "Producer", dataKey: "producer", displayLabel: true },
    { label: "Cast", dataKey: "cast", displayLabel: true },
  ],
  tv: [
    { label: "Description", dataKey: "description", displayLabel: false },
    { label: "Director", dataKey: "director", displayLabel: true },
    { label: "Producer", dataKey: "producer", displayLabel: true },
    { label: "Cast", dataKey: "cast", displayLabel: true },
  ],
  music: [
    { label: "Album", dataKey: "album" },
    { label: "Artist", dataKey: "artist" },
  ],
  book: [
    { label: "Description", dataKey: "description", displayLabel: false },
    { label: "Author", dataKey: "author", displayLabel: true },
    { label: "Genre", dataKey: "genre", displayLabel: true },
  ],
};

const MediaInfoDisplay = ({ mediaType, mediaInfo }) => {
  const config = mediaTypeConfig[mediaType.toLowerCase()];

  if (!config) return null;

  return (
    <div>
      {config.map(({ label, dataKey, displayLabel }) => (
        <DisplayLabelData
          key={label}
          data={mediaInfo[dataKey]}
          label={label}
          displayLabel={displayLabel}
        />
      ))}
    </div>
  );
};

const DisplayLabelData = ({ data, label, displayLabel }) => {
  const listToString = (list) => {
    let newString = "";

    if (typeof list === "string") {
      return list;
    }

    list &&
      list.length > 0 &&
      list.forEach((name) => {
        newString += name + ", ";
      });

    return newString.substring(0, newString.length - 2);
  };

  if (!data || data.length === 0) return null;

  return (
    <Typography mb={3}>
      {displayLabel && <span>{label}: </span>}
      {listToString(data)}
    </Typography>
  );
};

const MediaInfo = () => {
  const { id, mediaType } = useParams();
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openPlaylist, setOpenPlaylist] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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

  const { mutate: addToWishlist } = useMutation({
    mutationFn: async (requestBody) => {
      await WishlistClient.addToWishlist(requestBody);
    },
    onSuccess: () => {},
  });

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
    addToWishlist(requestBody);
  };

  const getTimeAgo = (date) => {
    const timeAgo = moment(date).fromNow(true);
    const units = timeAgo.split(" ")[1];
    return "" + timeAgo.split(" ")[0] + units[0];
  };

  const handlePlaylistOpen = () => {
    setOpenPlaylist(true);
  };

  const handlePlaylistClose = () => {
    setOpenPlaylist(false);
  };

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginTop: "25px", marginBottom: "25px" }}
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
                <Grid container spacing={5} sx={{ paddingTop: "20px" }}>
                  <Grid item xs={12}>
                    <Typography variant="h3">{mediaInfo.name}</Typography>
                  </Grid>
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
                  <Grid item xs={12} container justifyContent="center">
                    <PrimaryButton
                      variant="text"
                      leftIcon={<AddIcon style={{ color: "#00a8ff" }} />}
                      onClick={handlePlaylistOpen}
                    >
                      Add to Playlist
                    </PrimaryButton>
                  </Grid>
                  <Grid item xs={12} sx={{ marginTop: "15px" }}>
                    <Stack spacing={6} direction="column">
                      <MediaInfoDisplay
                        mediaType={mediaInfo.mediaType}
                        mediaInfo={mediaInfo}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              )
            )}
          </Paper>
        </Box>
        {ratingsList && ratingsList.length > 0 && (
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "17px",
              margin: "15px 0 150px 0",
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
      {isMobile ? (
        <MobilePlaylistDrawer
          open={openPlaylist}
          onClose={handlePlaylistClose}
          // onSubmit={handleSubmit}
          mediaId={mediaInfo != null && mediaInfo._id}
        />
      ) : (
        <DesktopPlaylistDialog
          open={openPlaylist}
          onClose={handlePlaylistClose}
          // onSubmit={handleSubmit}
          mediaId={mediaInfo && mediaInfo._id}
        />
      )}
    </Box>
  );
};

export default MediaInfo;
