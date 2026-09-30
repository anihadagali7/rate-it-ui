import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiResponse, MediaCategory } from "../types/api";

type MediaInfoPath =
  | "/api/media/movie/info/{tmdbId}"
  | "/api/media/tv/info/{tmdbId}"
  | "/api/media/music/info/{spotifyId}"
  | "/api/media/book/info/{googleBookId}";

export default class MediaClient {
  /** `id` is the external id (TMDB, Spotify, or Google Books). */
  static getMediaInfoDetails(
    mediaType: MediaCategory,
    id: string
  ): Promise<AxiosResponse<ApiResponse<MediaInfoPath, "get">>> {
    const url = `${API_URL}/api/media/${mediaType}/info/${id}`;
    return axios.get(url, getHeaders());
  }
}
