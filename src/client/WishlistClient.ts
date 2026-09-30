import axios, { type AxiosResponse } from "axios";

import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type { ApiRequest, ApiResponse } from "../types/api";

export default class WishlistClient {
  static addToWishlist(
    wishlist: ApiRequest<"/api/wishlist", "post">
  ): Promise<AxiosResponse<ApiResponse<"/api/wishlist", "post">>> {
    const url = `${API_URL}/api/wishlist`;
    return axios.post(url, wishlist, getHeaders());
  }

  /** `mediaId` is the external media id (`Media.mediaId`). */
  static removeFromWishlist(
    mediaId: string
  ): Promise<AxiosResponse<ApiResponse<"/api/wishlist/{mediaId}", "delete">>> {
    const url = `${API_URL}/api/wishlist/${mediaId}`;
    return axios.delete(url, getHeaders());
  }

  static getAllWishlistForUser(
    userName: string
  ): Promise<
    AxiosResponse<ApiResponse<"/api/wishlist/user/{userName}", "get">>
  > {
    const url = `${API_URL}/api/wishlist/user/${userName}`;
    return axios.get(url, getHeaders());
  }
}
