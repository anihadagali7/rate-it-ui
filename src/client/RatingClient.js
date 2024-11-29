import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

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

  static getFeedRatings(userName) {
    const url = `${API_URL}/api/ratings/following/${userName}`;
    return axios.get(url, getHeaders());
  }
}