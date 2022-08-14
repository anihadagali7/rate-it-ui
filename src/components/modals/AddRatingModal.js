import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  Rating,
  StyledEngineProvider,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import RatingClient from "../../client/RatingClient";


const AddRatingModal = ({ open, onClose, mediaDetails, user }) => {
  const [comments, setComments] = useState("");
  const [rating, setRating] = React.useState(5);


  const onChangeComments = (event) => {
    setComments(event.target.value);
  };

  const onChangeRating = (event) => {
    setRating(event.target.value);
  };

  const resetComments = () => {
    setComments("");
  };

  useEffect(() => {
  }, []);

  const handleSubmitRating = async () => {
    let requestBody = {};
    requestBody.mediaId = mediaDetails.mediaId;
    requestBody.userName = user.userName;
    requestBody.comments = comments;
    requestBody.rating = rating;
    await RatingClient.submitRating(requestBody);
    onClose();
  };

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{
                      "& .MuiDialog-paper": {
                        width: "100%",
                        maxHeight: 325,
                        maxWidth: 400,
                        overflowY: "hidden"
                      }
                    }}>
              <DialogTitle
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "0px",
                  textAlign: "center"
                }}>{mediaDetails.name}</DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Container
                  maxWidth={"sm"}
                  sx={{ marginTop: "20px", marginBottom: "25px" }}
                >
                  <Typography component="legend">Enter a rating: </Typography>
                  <Rating name="customized-10" defaultValue={5} max={10} precision={0.5}
                          value={rating} onChange={onChangeRating} sx={{ marginBottom: "15px" }} />
                  <Paper elevation={4}
                         component="form"
                         sx={{
                           p: "2px 4px",
                           display: "flex",
                           alignItems: "center",
                           width: "auto",
                           borderRadius: "17px"
                         }}
                  >
                    <TextField
                      sx={{
                        width: "100%",
                        "& fieldset": {
                          border: "none"
                        }
                      }}
                      size="small"
                      placeholder="Enter comments"
                      multiline
                      value={comments}
                      onChange={onChangeComments}
                      required
                      helperText="Max character count: 100"
                      inputProps={{ maxLength: 100 }}
                    />
                    {comments.length > 0 && (
                      <IconButton sx={{ p: "10px" }} onClick={resetComments}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Paper>
                  <Button
                    variant="outlined"
                    startIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
                    sx={{
                      border: "transparent",
                      backgroundColor: "#00a8ff",
                      width: "100%",
                      borderRadius: "17px",
                      marginTop: "20px",
                      "&.MuiButtonBase-root:hover": {
                        border: "transparent",
                        backgroundColor: "#00a8ff"
                      }
                    }}
                    onClick={handleSubmitRating}
                  >
                    <Typography variant="normalText">Submit</Typography>
                  </Button>
                </Container>
              </Box>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default AddRatingModal;