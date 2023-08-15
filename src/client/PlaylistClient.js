import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const createPlaylist = (playlist) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .post(API_URL + `/api/playlist/create`, playlist, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    })
    .then((response) => {
      return response.data;
    });
};

const addMediaToPlaylist = (playlistMedia) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .post(API_URL + `/api/playlist/addMedia`, playlistMedia, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    })
    .then((response) => {
      return response.data;
    });
};

const getAllPlaylistForUser = (userName) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(API_URL + `/api/playlist/user/${userName}`, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    })
    .then((response) => {
      return response.data;
    });
};

const getAllMediaForPlaylist = (playlistId) => {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  return axios
    .get(API_URL + `/api/playlist/${playlistId}`, {
      headers: {
        Authorization: ACCESS_TOKEN
      }
    })
    .then((response) => {
      return response.data;
    });
};

export default { createPlaylist, addMediaToPlaylist, getAllPlaylistForUser, getAllMediaForPlaylist };
