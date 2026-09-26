import axios, { type AxiosResponse } from "axios";

import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";
import type {
  AddToWishlistRequest,
  ApiSuccess,
  WishlistDocument,
  WishlistItem,
} from "../types/api";

export default class WishlistClient {
  static addToWishlist(
    wishlist: AddToWishlistRequest
  ): Promise<AxiosResponse<ApiSuccess<{ newWishlist: WishlistDocument }>>> {
    const url = `${API_URL}/api/wishlist`;
    return axios.post(url, wishlist, getHeaders());
  }

  /** `mediaId` is the external media id (`Media.mediaId`). */
  static removeFromWishlist(
    mediaId: string
  ): Promise<AxiosResponse<ApiSuccess<{ deletedWishlist: WishlistDocument }>>> {
    const url = `${API_URL}/api/wishlist/${mediaId}`;
    return axios.delete(url, getHeaders());
  }

  static getAllWishlistForUser(
    userName: string
  ): Promise<AxiosResponse<ApiSuccess<{ wishlistList: WishlistItem[] }>>> {
    const url = `${API_URL}/api/wishlist/user/${userName}`;
    return axios.get(url, getHeaders());
  }
}
