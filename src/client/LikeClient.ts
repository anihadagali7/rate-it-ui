import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiSuccess, LikeDocument, ObjectId } from "../types/api";

export default class LikeClient {
  static likeRating(
    ratingId: ObjectId
  ): Promise<AxiosResponse<ApiSuccess<{ newLike: LikeDocument }>>> {
    const url = `${API_URL}/api/likes`;
    return axios.post(url, { ratingId }, getHeaders());
  }

  static unlikeRating(
    ratingId: ObjectId
  ): Promise<AxiosResponse<ApiSuccess<{ deletedLike: LikeDocument }>>> {
    const url = `${API_URL}/api/likes/${ratingId}`;
    return axios.delete(url, getHeaders());
  }
}
