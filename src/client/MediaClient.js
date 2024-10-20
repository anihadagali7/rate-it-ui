import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class MediaClient {
  static getMediaInfoDetails(mediaType, id) {
    const url = `${API_URL}/api/media/${mediaType}/info/${id}`;
    return axios.get(url, getHeaders());
  }
}
