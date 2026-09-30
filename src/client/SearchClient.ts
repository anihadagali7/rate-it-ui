import axios, { type AxiosResponse } from "axios";

import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  ApiRequest,
  ApiResponse,
  MediaCategory,
  MediaSearchResponse,
  UserSearchResponse,
} from "../types/api";

export default class SearchClient {
  static searchMedia(
    mediaType: "user",
    keyWord: string,
    page?: number
  ): Promise<AxiosResponse<UserSearchResponse>>;
  static searchMedia<T extends MediaCategory>(
    mediaType: T,
    keyWord: string,
    page?: number
  ): Promise<AxiosResponse<MediaSearchResponse<T>>>;
  static searchMedia(
    mediaType: MediaCategory | "user",
    keyWord: string,
    page?: number
  ): Promise<
    AxiosResponse<UserSearchResponse | MediaSearchResponse<MediaCategory>>
  > {
    const url = `${API_URL}/api/search/${mediaType}`;
    return axios.post(url, { keyWord: keyWord, page: page }, getHeaders());
  }

  static searchAllMedia(
    keyWord: string
  ): Promise<AxiosResponse<ApiResponse<"/api/search/all", "post">>> {
    const url = `${API_URL}/api/search/all`;
    const body: ApiRequest<"/api/search/all", "post"> = { keyWord };
    return axios.post(url, body, getHeaders());
  }
}
