import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse } from "../types/api";

export default class UserClient {
  /** Returns an `AccountUser` for the signed-in user's own profile, otherwise a `PublicUser`. */
  static getUserInfo(
    userName: string
  ): Promise<AxiosResponse<ApiResponse<"/api/account/{userName}", "get">>> {
    const url = `${API_URL}/api/account/${userName}`;
    return axios.get(url, getHeaders());
  }

  static getMe(): Promise<
    AxiosResponse<ApiResponse<"/api/account/me", "get">>
  > {
    const url = `${API_URL}/api/account/me`;
    return axios.get(url, getHeaders());
  }

  static getAllUsers(): Promise<
    AxiosResponse<ApiResponse<"/api/allUsers", "get">>
  > {
    const url = `${API_URL}/api/allUsers`;
    return axios.get(url, getHeaders());
  }

  static getFollowing(
    userName: string
  ): Promise<AxiosResponse<ApiResponse<"/api/{userName}/following", "get">>> {
    const url = `${API_URL}/api/${userName}/following`;
    return axios.get(url, getHeaders());
  }

  static getFollowers(
    userName: string
  ): Promise<AxiosResponse<ApiResponse<"/api/{userName}/followers", "get">>> {
    const url = `${API_URL}/api/${userName}/followers`;
    return axios.get(url, getHeaders());
  }

  static getFriendsList(
    userName: string
  ): Promise<AxiosResponse<ApiResponse<"/api/{userName}/friendsList", "get">>> {
    const url = `${API_URL}/api/${userName}/friendsList`;
    return axios.get(url, getHeaders());
  }

  static unFollowUser(
    userToUnfollow: string
  ): Promise<AxiosResponse<ApiResponse<"/api/friends/unfollow", "post">>> {
    const url = `${API_URL}/api/friends/unfollow`;
    const body: ApiRequest<"/api/friends/unfollow", "post"> = {
      userToUnfollow,
    };
    return axios.post(url, body, getHeaders());
  }

  static followUser(
    userToFollow: string
  ): Promise<AxiosResponse<ApiResponse<"/api/friends/follow", "post">>> {
    const url = `${API_URL}/api/friends/follow`;
    const body: ApiRequest<"/api/friends/follow", "post"> = { userToFollow };
    return axios.post(url, body, getHeaders());
  }
}
