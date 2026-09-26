import axios from "axios";

import { getHeaders } from "../utils/AuthorizationUtils";
import { BASE_URL as API_URL } from "../config";

export default class WishlistClient {
  static addToWishlist(wishlist) {
    const url = `${API_URL}/api/wishlist`;
    return axios.post(url, wishlist, getHeaders());
  }

  static removeFromWishlist(mediaId) {
    const url = `${API_URL}/api/wishlist/${mediaId}`;
    return axios.delete(url, getHeaders());
  }

  static getAllWishlistForUser(userName) {
    const url = `${API_URL}/api/wishlist/user/${userName}`;
    return axios.get(url, getHeaders());
  }
}
