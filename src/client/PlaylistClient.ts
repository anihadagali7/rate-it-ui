import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  AddMediaToPlaylistRequest,
  ApiStatus,
  ApiSuccess,
  CreatePlaylistRequest,
  MediaByPlaylist,
  ObjectId,
  Playlist,
  PlaylistDocument,
  PlaylistMediaDocument,
  PlaylistsWithMediaResponse,
  UpdateMediaPlaylistsRequest,
} from "../types/api";

export default class PlaylistClient {
  static createPlaylist(
    playlist: CreatePlaylistRequest
  ): Promise<AxiosResponse<ApiSuccess<{ newPlaylist: PlaylistDocument }>>> {
    const url = `${API_URL}/api/playlist/create`;
    return axios.post(url, playlist, getHeaders());
  }

  static getAllPlaylistForUser(
    userName: string
  ): Promise<AxiosResponse<ApiSuccess<{ playlistList: Playlist[] }>>> {
    const url = `${API_URL}/api/playlist/user/${userName}`;
    return axios.get(url, getHeaders());
  }

  static addMediaToMultiplePlaylists(
    playlistMedia: UpdateMediaPlaylistsRequest
  ): Promise<AxiosResponse<ApiStatus>> {
    const url = `${API_URL}/api/playlist/addMediaToMultiplePlaylists`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static addMediaToPlaylist(
    playlistMedia: AddMediaToPlaylistRequest
  ): Promise<
    AxiosResponse<ApiSuccess<{ newPlaylist: PlaylistMediaDocument }>>
  > {
    const url = `${API_URL}/api/playlist/addMedia`;
    return axios.post(url, playlistMedia, getHeaders());
  }

  static getAllMediaForPlaylist(
    playlistId: ObjectId
  ): Promise<AxiosResponse<ApiSuccess<{ mediaByPlaylist: MediaByPlaylist }>>> {
    const url = `${API_URL}/api/playlist/${playlistId}`;
    return axios.get(url, getHeaders());
  }

  /** `mediaId` is `Media._id`, not the external id. */
  static getPlaylistsWithThisMedia(
    mediaId: ObjectId
  ): Promise<AxiosResponse<PlaylistsWithMediaResponse>> {
    const url = `${API_URL}/api/playlist/getPlaylistsWithThisMedia?mediaId=${mediaId}`;
    return axios.get(url, getHeaders());
  }
}
