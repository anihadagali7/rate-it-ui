import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";

export default class RatingClient {
  static submitRating(rating) {
    const url = `${API_URL}/api/ratings`;
    return axios.post(url, rating, getHeaders());
  }

  static getAllRatingsForUser(userName) {
    const url = `${API_URL}/api/ratings/user/${userName}`;
    return axios.get(url, getHeaders());
  }

  static getAllRatingsForMedia(mediaId) {
    const url = `${API_URL}/api/ratings/media/${mediaId}`;
    return axios.get(url, getHeaders());
  }

  static getAllExploreRatings() {
    const url = `${API_URL}/api/ratings/explore`;
    return axios.get(url, getHeaders());
  }

  static getFeedRatings() {
    const url = `${API_URL}/api/ratings/following`;
    return axios.get(url, getHeaders());
  }
}
