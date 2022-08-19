import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const login = (email, password, onError) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status, accessToken } = await axios.post(
        API_URL + "/api/login",
        {
          email,
          password,
        }
      );

      if (status === 200) {
        resolve(status);
        if (accessToken) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("accessToken", accessToken);
        }

        return data;
      }
    } catch (error) {
      let errors = error.response.data.errors;
      onError("email", true, errors.msg);
    }
  });
};

const signup = (newAccount, onError, onSuccess) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status, accessToken } = await axios.post(
        API_URL + "/api/create-user",
        newAccount
      );
      console.log("-> data", data, status);

      if (status === 201) {
        resolve(status);
        if (accessToken) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("accessToken", accessToken);
        }

        return data;
      }
    } catch (error) {
      console.log("some error in catch ", error);
    }
  });
};

export default { login, signup };
