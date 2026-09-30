import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse } from "../types/api";

export default class RatingClient {
  static submitRating(
    rating: ApiRequest<"/api/ratings", "post">
  ): Promise<AxiosResponse<ApiResponse<"/api/ratings", "post">>> {
    const url = `${API_URL}/api/ratings`;
    return axios.post(url, rating, getHeaders());
  }

  static getAllRatingsForUser(
    userName: string
  ): Promise<
    AxiosResponse<ApiResponse<"/api/ratings/user/{userName}", "get">>
  > {
    const url = `${API_URL}/api/ratings/user/${userName}`;
    return axios.get(url, getHeaders());
  }

  /** `mediaId` is the external media id (`Media.mediaId`). */
  static getAllRatingsForMedia(
    mediaId: string
  ): Promise<
    AxiosResponse<ApiResponse<"/api/ratings/media/{mediaId}", "get">>
  > {
    const url = `${API_URL}/api/ratings/media/${mediaId}`;
    return axios.get(url, getHeaders());
  }

  static getAllExploreRatings(): Promise<
    AxiosResponse<ApiResponse<"/api/ratings/explore", "get">>
  > {
    const url = `${API_URL}/api/ratings/explore`;
    return axios.get(url, getHeaders());
  }

  static getFeedRatings(): Promise<
    AxiosResponse<ApiResponse<"/api/ratings/following", "get">>
  > {
    const url = `${API_URL}/api/ratings/following`;
    return axios.get(url, getHeaders());
  }
}
