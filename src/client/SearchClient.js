import axios from "axios";

import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class SearchClient {
  static searchMedia(mediaType, keyWord, page) {
    const url = `${API_URL}/api/search/${mediaType}`;
    return axios.post(url, { keyWord: keyWord, page: page }, getHeaders());
  }

  static searchAllMedia(keyWord) {
    const url = `${API_URL}/api/search/all`;
    return axios.post(url, { keyWord: keyWord }, getHeaders());
  }
}
