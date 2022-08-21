import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const getMediaInfoDetails = (mediaType, id, onError) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
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
