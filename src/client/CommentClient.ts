import axios, { type AxiosResponse } from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  ApiSuccess,
  CommentDocument,
  CommentLikeDocument,
  NewComment,
  ObjectId,
} from "../types/api";

export default class CommentClient {
  static addComment(
    ratingId: ObjectId,
    text: string
  ): Promise<AxiosResponse<ApiSuccess<{ newComment: NewComment }>>> {
    const url = `${API_URL}/api/comments`;
    return axios.post(url, { ratingId, text }, getHeaders());
  }

  static deleteComment(
    commentId: ObjectId
  ): Promise<AxiosResponse<ApiSuccess<{ deletedComment: CommentDocument }>>> {
    const url = `${API_URL}/api/comments/${commentId}`;
    return axios.delete(url, getHeaders());
  }

  static likeComment(
    commentId: ObjectId
  ): Promise<AxiosResponse<ApiSuccess<{ newLike: CommentLikeDocument }>>> {
    const url = `${API_URL}/api/comments/${commentId}/like`;
    return axios.post(url, {}, getHeaders());
  }

  static unlikeComment(
    commentId: ObjectId
  ): Promise<AxiosResponse<ApiSuccess<{ deletedLike: CommentLikeDocument }>>> {
    const url = `${API_URL}/api/comments/${commentId}/like`;
    return axios.delete(url, getHeaders());
  }
}
