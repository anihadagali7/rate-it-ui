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
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.accessToken)
        );
      }

      return response.data;
    });
};

const signup = (newAccount) => {
  return axios
    .post(API_URL + "/api/create-user", newAccount)
    .then((response) => {
      console.log("response ", response);
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.accessToken)
        );
      }

      return response.data;
    });
};

export default { login, signup };
