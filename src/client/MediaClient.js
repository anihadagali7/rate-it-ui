import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const ACCESS_TOKEN = localStorage.getItem("accessToken");

const getMediaInfoDetails = (mediaType, id, onError) => {
  return axios
    .get(API_URL + `/api/media/${mediaType}/info/${id}`, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      let errors = error.response.data.errors;
      onError(errors.msg.length > 0);
    });
};

export default { getMediaInfoDetails };
