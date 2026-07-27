import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class CommentClient {
  static addComment(ratingId, text) {
    const url = `${API_URL}/api/comments`;
    return axios.post(url, { ratingId, text }, getHeaders());
  }

  static deleteComment(commentId) {
    const url = `${API_URL}/api/comments/${commentId}`;
    return axios.delete(url, getHeaders());
  }
}
