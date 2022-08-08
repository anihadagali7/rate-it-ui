import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const getUserInfo = (userName) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(
      API_URL + `/api/account/${userName}`,
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

export default {getUserInfo}