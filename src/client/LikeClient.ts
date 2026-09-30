import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse, ObjectId } from "../types/api";

export default class LikeClient {
  static likeRating(
    ratingId: ObjectId
  ): Promise<AxiosResponse<ApiResponse<"/api/likes", "post">>> {
    const url = `${API_URL}/api/likes`;
    const body: ApiRequest<"/api/likes", "post"> = { ratingId };
    return axios.post(url, body, getHeaders());
  }

  static unlikeRating(
    ratingId: ObjectId
  ): Promise<AxiosResponse<ApiResponse<"/api/likes/{ratingId}", "delete">>> {
    const url = `${API_URL}/api/likes/${ratingId}`;
    return axios.delete(url, getHeaders());
  }
}
