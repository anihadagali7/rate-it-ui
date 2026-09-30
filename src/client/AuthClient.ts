import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse } from "../types/api";

export default class AuthClient {
  static login(
    email: string,
    password: string
  ): Promise<AxiosResponse<ApiResponse<"/api/login", "post">>> {
    const url = `${API_URL}/api/login`;
    const body: ApiRequest<"/api/login", "post"> = { email, password };
    return axios.post(url, body);
  }

  static signUp(
    newAccount: ApiRequest<"/api/create-user", "post">
  ): Promise<AxiosResponse<ApiResponse<"/api/create-user", "post">>> {
    const url = `${API_URL}/api/create-user`;
    return axios.post(url, newAccount);
  }

  static editProfile(
    editAccount: ApiRequest<"/api/account/update", "put">
  ): Promise<AxiosResponse<ApiResponse<"/api/account/update", "put">>> {
    const url = `${API_URL}/api/account/update`;
    return axios.put(url, editAccount, getHeaders());
  }

  static resetPassword(
    passwordRequest: ApiRequest<"/api/account/resetPassword", "post">
  ): Promise<AxiosResponse<ApiResponse<"/api/account/resetPassword", "post">>> {
    const url = `${API_URL}/api/account/resetPassword`;
    return axios.post(url, passwordRequest, getHeaders());
  }

  static loginWithGoogle(
    code: string
  ): Promise<AxiosResponse<ApiResponse<"/api/auth/google", "post">>> {
    const url = `${API_URL}/api/auth/google`;
    const body: ApiRequest<"/api/auth/google", "post"> = { code };
    return axios.post(url, body);
  }

  static loginWithFacebook(
    accessToken: string
  ): Promise<AxiosResponse<ApiResponse<"/api/auth/facebook", "post">>> {
    const url = `${API_URL}/api/auth/facebook`;
    const body: ApiRequest<"/api/auth/facebook", "post"> = { accessToken };
    return axios.post(url, body);
  }

  static loginWithApple({
    identityToken,
    user,
  }: ApiRequest<"/api/auth/apple", "post">): Promise<
    AxiosResponse<ApiResponse<"/api/auth/apple", "post">>
  > {
    const url = `${API_URL}/api/auth/apple`;
    return axios.post(url, { identityToken, user });
  }

  static completeProfile(
    profile: ApiRequest<"/api/account/complete-profile", "put">
  ): Promise<
    AxiosResponse<ApiResponse<"/api/account/complete-profile", "put">>
  > {
    const url = `${API_URL}/api/account/complete-profile`;
    return axios.put(url, profile, getHeaders());
  }

  static uploadProfilePicture(
    file: File
  ): Promise<AxiosResponse<ApiResponse<"/api/account/picture", "put">>> {
    const url = `${API_URL}/api/account/picture`;
    const formData = new FormData();
    formData.append("picture", file);
    return axios.put(url, formData, getHeaders());
  }

  static forgotPassword(
    email: string
  ): Promise<AxiosResponse<ApiResponse<"/api/forgot-password", "post">>> {
    const url = `${API_URL}/api/forgot-password`;
    const body: ApiRequest<"/api/forgot-password", "post"> = { email };
    return axios.post(url, body);
  }

  static resetPasswordWithToken(
    token: string,
    newPassword: string
  ): Promise<AxiosResponse<ApiResponse<"/api/reset-password", "post">>> {
    const url = `${API_URL}/api/reset-password`;
    const body: ApiRequest<"/api/reset-password", "post"> = {
      token,
      newPassword,
    };
    return axios.post(url, body);
  }
}
