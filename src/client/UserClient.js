import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class UserClient {
  static getUserInfo(userName) {
    const url = `${API_URL}/api/account/${userName}`;
    return axios.get(url, getHeaders());
  }

  static getAllUsers() {
    const url = `${API_URL}/api/allUsers`;
    return axios.get(url, getHeaders());
  }

  static getFollowing(userName) {
    const url = `${API_URL}/api/${userName}/following`;
    return axios.get(url, getHeaders());
  }

  static getFollowers(userName) {
    const url = `${API_URL}/api/${userName}/followers`;
    return axios.get(url, getHeaders());
  }

  static  getFriendsList(userName) {
    const url = `${API_URL}/api/${userName}/friendsList`;
    return axios.get(url, getHeaders());
  }

  static unFollowUser(currentUser, userToUnfollow) {
    const url = `${API_URL}/api/friends/unfollow`;
    return axios.post(url, {
        currentUser,
        userToUnfollow,
      }, getHeaders());
  }

  static followUser(currentUser, userToFollow) {
    const url = `${API_URL}/api/friends/follow`;
    return axios.post(
      url,
      {
        currentUser,
        userToFollow,
      },
      getHeaders()
    );
  }
}
