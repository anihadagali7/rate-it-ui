import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Provider } from "jotai";
import { theme } from "../Theme/Theme";
import MediaClient from "../client/MediaClient";
import {
  Container,
  InputLabel,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import NotFoundImage from "../imgs/Image-Not-Available.jpeg";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const MediaInfo = () => {
  const [mediaTypeParams, setMediaTypeParams] = useState("");
  const [mediaIdParams, setMediaIdParams] = useState("");
  const { id, mediaType } = useParams();
  const [media, setMedia] = useState({});

  useEffect(async () => {
    console.log("i fire once");
    setMediaTypeParams(mediaType);
    setMediaIdParams(id);
    const result = await MediaClient.getMediaInfoDetails(mediaType, id);
    console.log("result of media client ", result);
    setMedia(result.data.media);
  }, []);

  const listToString = (list) => {
    let newString = "";

    list.forEach((name) => {
      newString += name + ", ";
    });

    return newString.substring(0, newString.length - 2);
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
        <List component="nav" aria-label="mailbox folders">
          <Divider />
          {media.director && media.director.length > 0 && (
            <ListItem>
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
            <ListItem>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Producers:
                </span>
                {listToString(media.producer)}
              </Typography>
            </ListItem>
          )}
          <Divider />
          {media.cast && media.cast.length > 0 && (
            <ListItem>
              <Typography component="div">
                <span style={{ fontWeight: "550", fontSize: "17px" }}>
                  Cast:
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

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}></ThemeProvider>
        <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
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
                <Box>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 2, xl: 5 }}
                    columns={{ md: 12 }}
                  >
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
                    {displayMovieTvShow(media)}
                  </Grid>
                </Box>
              </div>
            </Paper>
          </Box>
        </Container>
      </StyledEngineProvider>
    </Provider>
  );
};

export default MediaInfo;
