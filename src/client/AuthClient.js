import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const login = (email, password, onError) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.post(
        API_URL + "/api/login",
        {
          email,
          password,
        }
      );

      if (status === 200) {
        if (data.accessToken) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("accessToken", data.accessToken);
        }

        resolve(data.data);
      }
    } catch (error) {
      let errors = error.response.data.errors;
      onError("email", true, errors.msg);
    }
  });
};

const signup = (newAccount, onError) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.post(
        API_URL + "/api/create-user",
        newAccount
      );
      if (status === 201) {
        if (data.accessToken) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("accessToken", data.accessToken);
        }

        resolve(data.data);
      }
    } catch (error) {
      let errors = error.response.data.errors;
      if(errors.msg.includes("email")){
        onError("email", true, errors.msg);
      }
      if(errors.msg.includes("username")){
        onError("userName", true, errors.msg);
      }
    }
  });
};

const editProfile = (newAccount, onError) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.put(
        API_URL + "/api/account/update",
        newAccount, {
          headers: {
            Authorization: ACCESS_TOKEN,
          },
        }
      );
      if (status === 200) {
        resolve(data.data);
      }
    } catch (error) {
      let errors = error.response.data.errors;
      if(errors.msg.includes("email")){
        onError("email", true, errors.msg);
      }
      if(errors.msg.includes("username")){
        onError("userName", true, errors.msg);
      }
    }
  });
};

const resetPassword = (newPasswordRequest, onError) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.post(
        API_URL + "/api/account/resetPassword",
        newPasswordRequest, {
          headers: {
            Authorization: ACCESS_TOKEN,
          },
        }
      );
      if (status === 200) {
        resolve(data.data);
      }
      console.log("part of status now", status)
    } catch (error) {
      let errors = error.response.data.errors;
      console.log("part of error now", errors)
      if(errors.msg.includes("Current password is not valid")){
        onError("currentPassword", true, errors.msg);
      }
      // if(errors.msg.includes("username")){
      //   onError("userName", true, errors.msg);
      // }
    }
  });
};

export default { login, signup, editProfile, resetPassword };
