import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const ACCESS_TOKEN = localStorage.getItem("accessToken");

const submitRating = (rating) => {
  return axios
    .post(API_URL + `/api/rating`, rating, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const getAllRatingsForUser = (userName) => {
  return axios
    .get(API_URL + `/api/ratings/user/${userName}`, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const getAllRatingsForMedia = (mediaId) => {
  return axios
    .get(API_URL + `/api/ratings/media/${mediaId}`, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const getAllExploreRatings= () => {
  return axios
    .get(API_URL + `/api/ratings/explore`, {})
    .then((response) => {
      return response.data;
    });
};

const getFeedRatings= (userName) => {
  return axios
    .get(API_URL + `/api/ratings/following/${userName}`, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export default { submitRating, getAllRatingsForUser, getAllRatingsForMedia, getAllExploreRatings, getFeedRatings };
