import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  ApiSuccess,
  Rating,
  RatingDocument,
  SubmitRatingRequest,
} from "../types/api";

type RatingsListResponse = ApiSuccess<{ ratingsList: Rating[] }>;

export default class RatingClient {
  static submitRating(
    rating: SubmitRatingRequest
  ): Promise<AxiosResponse<ApiSuccess<{ newRating: RatingDocument }>>> {
    const url = `${API_URL}/api/ratings`;
    return axios.post(url, rating, getHeaders());
  }

  static getAllRatingsForUser(
    userName: string
  ): Promise<AxiosResponse<RatingsListResponse>> {
    const url = `${API_URL}/api/ratings/user/${userName}`;
    return axios.get(url, getHeaders());
  }

  /** `mediaId` is the external media id (`Media.mediaId`). */
  static getAllRatingsForMedia(
    mediaId: string
  ): Promise<AxiosResponse<RatingsListResponse>> {
    const url = `${API_URL}/api/ratings/media/${mediaId}`;
    return axios.get(url, getHeaders());
  }

  static getAllExploreRatings(): Promise<AxiosResponse<RatingsListResponse>> {
    const url = `${API_URL}/api/ratings/explore`;
    return axios.get(url, getHeaders());
  }

  static getFeedRatings(): Promise<AxiosResponse<RatingsListResponse>> {
    const url = `${API_URL}/api/ratings/following`;
    return axios.get(url, getHeaders());
  }
}
