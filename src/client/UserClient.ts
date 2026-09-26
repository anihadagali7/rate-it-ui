import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  AccountUser,
  ApiStatus,
  ApiSuccess,
  PublicUser,
} from "../types/api";

export default class UserClient {
  /** Returns an `AccountUser` for the signed-in user's own profile, otherwise a `PublicUser`. */
  static getUserInfo(
    userName: string
  ): Promise<AxiosResponse<ApiSuccess<{ user: AccountUser | PublicUser }>>> {
    const url = `${API_URL}/api/account/${userName}`;
    return axios.get(url, getHeaders());
  }

  static getMe(): Promise<AxiosResponse<ApiSuccess<{ user: AccountUser }>>> {
    const url = `${API_URL}/api/account/me`;
    return axios.get(url, getHeaders());
  }

  static getAllUsers(): Promise<AxiosResponse<ApiSuccess<PublicUser[]>>> {
    const url = `${API_URL}/api/allUsers`;
    return axios.get(url, getHeaders());
  }

  static getFollowing(
    userName: string
  ): Promise<AxiosResponse<ApiSuccess<PublicUser[]>>> {
    const url = `${API_URL}/api/${userName}/following`;
    return axios.get(url, getHeaders());
  }

  static getFollowers(
    userName: string
  ): Promise<AxiosResponse<ApiSuccess<PublicUser[]>>> {
    const url = `${API_URL}/api/${userName}/followers`;
    return axios.get(url, getHeaders());
  }

  static getFriendsList(
    userName: string
  ): Promise<
    AxiosResponse<
      ApiSuccess<{ followersList: PublicUser[]; followingList: PublicUser[] }>
    >
  > {
    const url = `${API_URL}/api/${userName}/friendsList`;
    return axios.get(url, getHeaders());
  }

  static unFollowUser(
    userToUnfollow: string
  ): Promise<AxiosResponse<ApiStatus>> {
    const url = `${API_URL}/api/friends/unfollow`;
    return axios.post(
      url,
      {
        userToUnfollow,
      },
      getHeaders()
    );
  }

  static followUser(userToFollow: string): Promise<AxiosResponse<ApiStatus>> {
    const url = `${API_URL}/api/friends/follow`;
    return axios.post(
      url,
      {
        userToFollow,
      },
      getHeaders()
    );
  }
}
