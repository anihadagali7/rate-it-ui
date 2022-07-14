import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const login = (email, password) => {
  return axios
    .post(API_URL + "/api/login", {
      email,
      password,
    })
    .then((response) => {
      console.log("response ", response);
      if (response.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.accessToken));
      }

      return response.data;
    });
};

export default { login };
