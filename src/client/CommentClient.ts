import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse, ObjectId } from "../types/api";

export default class CommentClient {
  static addComment(
    ratingId: ObjectId,
    text: string
  ): Promise<AxiosResponse<ApiResponse<"/api/comments", "post">>> {
    const url = `${API_URL}/api/comments`;
    const body: ApiRequest<"/api/comments", "post"> = { ratingId, text };
    return axios.post(url, body, getHeaders());
  }

  static deleteComment(
    commentId: ObjectId
  ): Promise<
    AxiosResponse<ApiResponse<"/api/comments/{commentId}", "delete">>
  > {
    const url = `${API_URL}/api/comments/${commentId}`;
    return axios.delete(url, getHeaders());
  }

  static likeComment(
    commentId: ObjectId
  ): Promise<
    AxiosResponse<ApiResponse<"/api/comments/{commentId}/like", "post">>
  > {
    const url = `${API_URL}/api/comments/${commentId}/like`;
    return axios.post(url, {}, getHeaders());
  }

  static unlikeComment(
    commentId: ObjectId
  ): Promise<
    AxiosResponse<ApiResponse<"/api/comments/{commentId}/like", "delete">>
  > {
    const url = `${API_URL}/api/comments/${commentId}/like`;
    return axios.delete(url, getHeaders());
  }
}
