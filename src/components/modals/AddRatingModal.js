import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { Provider } from "jotai";
import RatingClient from "../../client/RatingClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import TextAreaField from "../../shared/inputfield/TextAreaField";

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
    <Provider>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxHeight: 600,
            maxWidth: 500,
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
        <Box sx={{ margin: "20px" }}>
          <Grid
            container
            spacing={{ xs: 2, md: 2, xl: 2 }}
            columns={{ md: 12 }}
          >
            <Grid item xs={12}>
              <Typography component="legend">Enter a rating: </Typography>
            </Grid>
            <Grid item xs={12}>
              <Rating
                defaultValue={5}
                max={10}
                precision={0.1}
                value={payload.rating}
                name="rating"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextAreaField
                label="Enter comments"
                required
                hasCharacterCount
                maxCharacters={100}
                minRows={2}
                value={payload.comments}
                name="comments"
                onChange={(e) => handleChange(e)}
              ></TextAreaField>
            </Grid>
            <Grid item xs={12} container justifyContent="end">
              <PrimaryButton
                variant="contained"
                disabled={checkToDisable()}
                onClick={handleSubmitRating}
              >
                Submit
              </PrimaryButton>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Provider>
  );
};

export default AddRatingModal;
