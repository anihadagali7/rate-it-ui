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

  static resetPassword(passwordRequest) {
    const url = `${API_URL}/api/account/resetPassword`;
    return axios.post(url, passwordRequest, getHeaders());
  }

  static loginWithGoogle(code) {
    const url = `${API_URL}/api/auth/google`;
    return axios.post(url, { code });
  }

  static loginWithFacebook(accessToken) {
    const url = `${API_URL}/api/auth/facebook`;
    return axios.post(url, { accessToken });
  }

  static loginWithApple({ identityToken, user }) {
    const url = `${API_URL}/api/auth/apple`;
    return axios.post(url, { identityToken, user });
  }

  static completeProfile(profile) {
    const url = `${API_URL}/api/account/complete-profile`;
    return axios.put(url, profile, getHeaders());
  }

  static uploadProfilePicture(file) {
    const url = `${API_URL}/api/account/picture`;
    const formData = new FormData();
    formData.append("picture", file);
    return axios.put(url, formData, getHeaders());
  }

  static forgotPassword(email) {
    const url = `${API_URL}/api/forgot-password`;
    return axios.post(url, { email });
  }

  static resetPasswordWithToken(token, newPassword) {
    const url = `${API_URL}/api/reset-password`;
    return axios.post(url, { token, newPassword });
  }
}
