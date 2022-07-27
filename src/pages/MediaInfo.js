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
              }}
            >
              <div style={{ padding: "0 35px", minHeight: "385px" }}>
                <Box>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 2, xl: 5 }}
                    columns={{ md: 12 }}
                  >
                    <Grid item xs={12}>
                      <Typography>
                        <img
                          width={100}
                          height={150}
                          style={{ marginBottom: "10px" }}
                          alt="poster"
                          src={media.picture ? media.picture : NotFoundImage}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={9} sx={{ width: "100%" }}>
                      {media.name}
                    </Grid>
                    <Grid item xs={3}></Grid>
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
