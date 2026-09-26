import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";

export default class LikeClient {
  static likeRating(ratingId) {
    const url = `${API_URL}/api/likes`;
    return axios.post(url, { ratingId }, getHeaders());
  }

  static unlikeRating(ratingId) {
    const url = `${API_URL}/api/likes/${ratingId}`;
    return axios.delete(url, getHeaders());
  }
}
