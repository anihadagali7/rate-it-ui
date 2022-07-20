import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const searchMedia = (mediaType, keyWord) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
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
    });
};

export default { searchMedia };
