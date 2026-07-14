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

  static addMediaToMultiplePlaylists(playlistMedia) {
    const url = `${API_URL}/api/playlist/addMediaToMultiplePlaylists`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static addMediaToPlaylist(playlistMedia) {
    const url = `${API_URL}/api/playlist/addMedia`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static getAllMediaForPlaylist(playlistId) {
    const url = `${API_URL}/api/playlist/${playlistId}`;
    return axios.get(url, getHeaders());
  }

  static getPlaylistsWithThisMedia(mediaId) {
    const url = `${API_URL}/api/playlist/getPlaylistsWithThisMedia?mediaId=${mediaId}`;
    return axios.get(url, getHeaders());
  }
}
