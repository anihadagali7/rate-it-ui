import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiSuccess, Media, MediaCategory } from "../types/api";

export default class MediaClient {
  /** `id` is the external id (TMDB, Spotify, or Google Books). */
  static getMediaInfoDetails(
    mediaType: MediaCategory,
    id: string
  ): Promise<AxiosResponse<ApiSuccess<{ media: Media }>>> {
    const url = `${API_URL}/api/media/${mediaType}/info/${id}`;
    return axios.get(url, getHeaders());
  }
}
