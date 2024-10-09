import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const getUserInfo = (userName) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(
      API_URL + `/api/account/${userName}`,
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const getAllUsers = () => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(
      API_URL + `/api/allUsers`,
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const getFollowing = (userName) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(
      API_URL + `/api/${userName}/following`,
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};


const getFollowers = (userName) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(
      API_URL + `/api/${userName}/followers`,
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.data;
    });
};

const unFollowUser = (currentUser, userToUnfollow) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .post(
      API_URL + `/api/friends/unfollow`,
      {
        currentUser, userToUnfollow
      },
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.status;
    });
}

const followUser = (currentUser, userToFollow) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .post(
      API_URL + `/api/friends/follow`,
      {
        currentUser, userToFollow
      },
      {
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      }
    )
    .then((response) => {
      return response.status;
    });
}

export default {getUserInfo, getFollowing, getFollowers, unFollowUser, followUser, getAllUsers}