import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const submitRating = (rating) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
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

export default { submitRating };
