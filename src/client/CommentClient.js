import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";

export default class CommentClient {
  static addComment(ratingId, text) {
    const url = `${API_URL}/api/comments`;
    return axios.post(url, { ratingId, text }, getHeaders());
  }

  static deleteComment(commentId) {
    const url = `${API_URL}/api/comments/${commentId}`;
    return axios.delete(url, getHeaders());
  }

  static likeComment(commentId) {
    const url = `${API_URL}/api/comments/${commentId}/like`;
    return axios.post(url, {}, getHeaders());
  }

  static unlikeComment(commentId) {
    const url = `${API_URL}/api/comments/${commentId}/like`;
    return axios.delete(url, getHeaders());
  }
}
