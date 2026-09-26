import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";

export default class MediaClient {
  static getMediaInfoDetails(mediaType, id) {
    const url = `${API_URL}/api/media/${mediaType}/info/${id}`;
    return axios.get(url, getHeaders());
  }
}
