import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const ACCESS_TOKEN = localStorage.getItem("accessToken");

const searchMedia = (mediaType, keyWord, onError) => {
  return axios
    .post(
      API_URL + `/api/search/${mediaType}`,
      { keyWord: keyWord },
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      let errors = error.response.data.errors;
      onError(errors.msg.length > 0);
    });
};

const searchAllMedia = (keyWord, onError) => {
  return axios
    .post(
      API_URL + `/api/search/all`,
      { keyWord: keyWord },
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      let errors = error.response.data.errors;
      onError(errors.msg.length > 0);
    });
};

export default { searchMedia, searchAllMedia };
