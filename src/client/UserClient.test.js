import axios from "axios";
import UserClient from "./UserClient";

jest.mock("axios");

const API_URL = process.env.REACT_APP_BASE_URL;
const authHeaders = { headers: { Authorization: "jwt-token" } };

describe("UserClient", () => {
  beforeEach(() => {
    localStorage.setItem("accessToken", "jwt-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("getUserInfo GETs the account by username with auth headers", () => {
    UserClient.getUserInfo("johndoe");

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/account/johndoe`,
      authHeaders
    );
  });

  it("getMe GETs the authenticated user's own account with auth headers", () => {
    UserClient.getMe();

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/account/me`,
      authHeaders
    );
  });

  it("getAllUsers GETs the full user list with auth headers", () => {
    UserClient.getAllUsers();

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/allUsers`,
      authHeaders
    );
  });

  it("getFollowing GETs the following list for a user", () => {
    UserClient.getFollowing("johndoe");

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/johndoe/following`,
      authHeaders
    );
  });

  it("getFollowers GETs the followers list for a user", () => {
    UserClient.getFollowers("johndoe");

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/johndoe/followers`,
      authHeaders
    );
  });

  it("getFriendsList GETs the friends list for a user", () => {
    UserClient.getFriendsList("johndoe");

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/johndoe/friendsList`,
      authHeaders
    );
  });

  it("unFollowUser POSTs only the target username, since identity comes from the JWT", () => {
    UserClient.unFollowUser("janedoe");

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/api/friends/unfollow`,
      { userToUnfollow: "janedoe" },
      authHeaders
    );
  });

  it("followUser POSTs only the target username, since identity comes from the JWT", () => {
    UserClient.followUser("janedoe");

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/api/friends/follow`,
      { userToFollow: "janedoe" },
      authHeaders
    );
  });
});
