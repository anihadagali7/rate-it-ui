import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  AccountUser,
  ApiSuccess,
  AppleLoginRequest,
  AuthResponse,
  CompleteProfileRequest,
  EditProfileRequest,
  ResetPasswordRequest,
  SignUpRequest,
} from "../types/api";

type UserResponse = ApiSuccess<{ user: AccountUser }>;

export default class AuthClient {
  static login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    const url = `${API_URL}/api/login`;
    return axios.post(url, {
      email,
      password,
    });
  }

  static signUp(
    newAccount: SignUpRequest
  ): Promise<AxiosResponse<AuthResponse>> {
    const url = `${API_URL}/api/create-user`;
    return axios.post(url, newAccount);
  }

  static editProfile(
    editAccount: EditProfileRequest
  ): Promise<AxiosResponse<UserResponse>> {
    const url = `${API_URL}/api/account/update`;
    return axios.put(url, editAccount, getHeaders());
  }

  static resetPassword(
    passwordRequest: ResetPasswordRequest
  ): Promise<AxiosResponse<UserResponse>> {
    const url = `${API_URL}/api/account/resetPassword`;
    return axios.post(url, passwordRequest, getHeaders());
  }

  static loginWithGoogle(code: string): Promise<AxiosResponse<AuthResponse>> {
    const url = `${API_URL}/api/auth/google`;
    return axios.post(url, { code });
  }

  static loginWithFacebook(
    accessToken: string
  ): Promise<AxiosResponse<AuthResponse>> {
    const url = `${API_URL}/api/auth/facebook`;
    return axios.post(url, { accessToken });
  }

  static loginWithApple({
    identityToken,
    user,
  }: AppleLoginRequest): Promise<AxiosResponse<AuthResponse>> {
    const url = `${API_URL}/api/auth/apple`;
    return axios.post(url, { identityToken, user });
  }

  static completeProfile(
    profile: CompleteProfileRequest
  ): Promise<AxiosResponse<UserResponse>> {
    const url = `${API_URL}/api/account/complete-profile`;
    return axios.put(url, profile, getHeaders());
  }

  static uploadProfilePicture(
    file: File
  ): Promise<AxiosResponse<UserResponse>> {
    const url = `${API_URL}/api/account/picture`;
    const formData = new FormData();
    formData.append("picture", file);
    return axios.put(url, formData, getHeaders());
  }

  // POST /api/forgot-password and /api/reset-password ship in
  // anihadagali7/rate-it-service#38 (services/passwordResetService.js).
  static forgotPassword(
    email: string
  ): Promise<AxiosResponse<ApiSuccess<{ msg: string }>>> {
    const url = `${API_URL}/api/forgot-password`;
    return axios.post(url, { email });
  }

  static resetPasswordWithToken(
    token: string,
    newPassword: string
  ): Promise<AxiosResponse<AuthResponse>> {
    const url = `${API_URL}/api/reset-password`;
    return axios.post(url, { token, newPassword });
  }
}
