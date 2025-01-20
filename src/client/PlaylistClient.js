import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class PlaylistClient {
  static createPlaylist(playlist) {
    const url = `${API_URL}/api/playlist/create`;
    return axios.post(url, playlist, getHeaders());
  }

  static getAllPlaylistForUser(userName) {
    const url = `${API_URL}/api/playlist/user/${userName}`;
    return axios.get(url, getHeaders());
  }

  static addMediaToPlaylist(playlistMedia) {
    const url = `${API_URL}/api/playlist/addMedia`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static getAllMediaForPlaylist(playlistId) {
    const url = `${API_URL}/api/playlist/${playlistId}`;
    return axios.get(url, getHeaders());
  }
}

// const createPlaylist = (playlist) => {
//   return axios
//     .post(API_URL + `/api/playlist/create`, playlist, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const addMediaToPlaylist = (playlistMedia) => {
//   return axios
//     .post(API_URL + `/api/playlist/addMedia`, playlistMedia, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const getAllMediaForPlaylist = (playlistId) => {
//   return axios
//     .get(API_URL + `/api/playlist/${playlistId}`, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };
