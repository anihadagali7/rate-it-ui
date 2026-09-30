import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse, ObjectId } from "../types/api";

export default class PlaylistClient {
  static createPlaylist(
    playlist: ApiRequest<"/api/playlist/create", "post">
  ): Promise<AxiosResponse<ApiResponse<"/api/playlist/create", "post">>> {
    const url = `${API_URL}/api/playlist/create`;
    return axios.post(url, playlist, getHeaders());
  }

  static getAllPlaylistForUser(
    userName: string
  ): Promise<
    AxiosResponse<ApiResponse<"/api/playlist/user/{userName}", "get">>
  > {
    const url = `${API_URL}/api/playlist/user/${userName}`;
    return axios.get(url, getHeaders());
  }

  static addMediaToMultiplePlaylists(
    playlistMedia: ApiRequest<
      "/api/playlist/addMediaToMultiplePlaylists",
      "post"
    >
  ): Promise<
    AxiosResponse<
      ApiResponse<"/api/playlist/addMediaToMultiplePlaylists", "post">
    >
  > {
    const url = `${API_URL}/api/playlist/addMediaToMultiplePlaylists`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static addMediaToPlaylist(
    playlistMedia: ApiRequest<"/api/playlist/addMedia", "post">
  ): Promise<AxiosResponse<ApiResponse<"/api/playlist/addMedia", "post">>> {
    const url = `${API_URL}/api/playlist/addMedia`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static getAllMediaForPlaylist(
    playlistId: ObjectId
  ): Promise<AxiosResponse<ApiResponse<"/api/playlist/{playlist}", "get">>> {
    const url = `${API_URL}/api/playlist/${playlistId}`;
    return axios.get(url, getHeaders());
  }

  /** `mediaId` is `Media._id`, not the external id. */
  static getPlaylistsWithThisMedia(
    mediaId: ObjectId
  ): Promise<
    AxiosResponse<ApiResponse<"/api/playlist/getPlaylistsWithThisMedia", "get">>
  > {
    const url = `${API_URL}/api/playlist/getPlaylistsWithThisMedia?mediaId=${mediaId}`;
    return axios.get(url, getHeaders());
  }
}
