import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class AuthClient {
  static login(email, password) {
    const url = `${API_URL}/api/login`;
    return axios.post(url, {
      email,
      password,
    });
  }

  static signUp(newAccount) {
    const url = `${API_URL}/api/create-user`;
    return axios.post(url, newAccount);
  }
}

// const login = (email, password, onError) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { data, status } = await axios.post(API_URL + "/api/login", {
//         email,
//         password,
//       });

//       if (status === 200) {
//         if (data.accessToken) {
//           localStorage.setItem("accessToken", data.accessToken);
//         }

//         resolve(data.data);
//       }
//     } catch (error) {
//       let errors = error.response.data.errors;
//       onError("email", true, errors.msg);
//     }
//   });
// };

// const signup = (newAccount, onError) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { data, status } = await axios.post(
//         API_URL + "/api/create-user",
//         newAccount
//       );
//       if (status === 201) {
//         if (data.accessToken) {
//           localStorage.setItem("user", JSON.stringify(data.data.user));
//           localStorage.setItem("accessToken", data.accessToken);
//         }

//         resolve(data.data);
//       }
//     } catch (error) {
//       let errors = error.response.data.errors;
//       if (errors.msg.includes("email")) {
//         onError("email", true, errors.msg);
//       }
//       if (errors.msg.includes("username")) {
//         onError("userName", true, errors.msg);
//       }
//     }
//   });
// };

// const editProfile = (newAccount, onError) => {

//   return new Promise(async (resolve, reject) => {
//     try {
//       const { data, status } = await axios.put(
//         API_URL + "/api/account/update",
//         newAccount,
//         getHeaders()
//       );
//       if (status === 200) {
//         resolve(data.data);
//       }
//     } catch (error) {
//       let errors = error.response.data.errors;
//       if (errors.msg.includes("email")) {
//         onError("email", true, errors.msg);
//       }
//       if (errors.msg.includes("username")) {
//         onError("userName", true, errors.msg);
//       }
//     }
//   });
// };

// const resetPassword = (newPasswordRequest, onError) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { data, status } = await axios.post(
//         API_URL + "/api/account/resetPassword",
//         newPasswordRequest,
//         getHeaders()
//       );
//       if (status === 200) {
//         resolve(data.data);
//       }
//     } catch (error) {
//       let errors = error.response.data.errors;
//       if (errors.msg.includes("Current password is not valid")) {
//         onError("currentPassword", true, errors.msg);
//       }
//     }
//   });
// };
