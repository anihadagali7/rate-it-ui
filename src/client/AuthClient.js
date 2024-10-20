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

  static editProfile(editAccount) {
    const url = `${API_URL}/api/account/update`;
    return axios.put(url, editAccount, getHeaders());
  }

  static resetPassword(newPassword) {
    const url = `${API_URL}/api/account/resetPassword`;
    return axios.put(url, newPassword, getHeaders());
  }
}
