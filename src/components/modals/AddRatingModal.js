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
  Typography,
} from "@mui/material";
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import StarIcon from "@mui/icons-material/Star";
import RatingClient from "../../client/RatingClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const AddRatingModal = ({
  open,
  onClose,
  mediaDetails,
  user,
  ratingAdded,
  setRatingAdded,
}) => {
  const [payload, setPayload] = useState({
    comments: "",
    rating: 5,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetComments = () => {
    setPayload((prevValues) => ({
      ...prevValues,
      ["comments"]: "",
    }));
  };

  const handleSubmitRating = async () => {
    let requestBody = {};
    requestBody.mediaId = mediaDetails.mediaId;
    requestBody.userName = user.userName;
    requestBody.comments = payload.comments;
    requestBody.rating = payload.rating;
    await RatingClient.submitRating(requestBody);
    setRatingAdded(!ratingAdded);
    onClose();
  };

  const checkToDisable = () => {
    const { rating, comments } = payload;

    const hasAllRequiredFields = rating && comments;

    return !hasAllRequiredFields;
  };

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog
              open={open}
              onClose={onClose}
              sx={{
                "& .MuiDialog-paper": {
                  width: "100%",
                  maxHeight: 325,
                  maxWidth: 400,
                  overflowY: "hidden",
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "0px",
                  textAlign: "center",
                }}
              >
                {mediaDetails.name}
              </DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Container
                  maxWidth={"sm"}
                  sx={{ marginTop: "20px", marginBottom: "25px" }}
                >
                  <Typography component="legend">Enter a rating: </Typography>
                  <Rating
                    defaultValue={5}
                    max={10}
                    precision={0.5}
                    value={payload.rating}
                    name="rating"
                    onChange={handleChange}
                    sx={{ marginBottom: "15px" }}
                  />
                  <Paper
                    elevation={4}
                    component="form"
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "auto",
                      borderRadius: "17px",
                    }}
                  >
                    <TextField
                      sx={{
                        width: "100%",
                        "& fieldset": {
                          border: "none",
                        },
                      }}
                      size="small"
                      placeholder="Enter comments"
                      multiline
                      value={payload.comments}
                      name="comments"
                      onChange={handleChange}
                      required
                      helperText="Max character count: 100"
                      inputProps={{ maxLength: 100 }}
                    />
                    {payload.comments.length > 0 && (
                      <PrimaryButton
                        variant="text"
                        onClick={resetComments}
                        leftIcon={<ClearIcon />}
                      ></PrimaryButton>
                    )}
                  </Paper>
                  <PrimaryButton
                    variant="contained"
                    disabled={checkToDisable()}
                    leftIcon={<StarIcon style={{ color: "#FFFFFF" }} />}
                    onClick={handleSubmitRating}
                  >
                    Submit
                  </PrimaryButton>
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
