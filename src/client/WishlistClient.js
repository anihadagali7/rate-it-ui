import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const ACCESS_TOKEN = localStorage.getItem("accessToken");

const addToWishlist = (wishlist) => {
  return axios
    .post(API_URL + `/api/wishlist`, wishlist, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    });
};

const getAllWishlistForUser = (userName) => {
  return axios
    .get(API_URL + `/api/wishlist/user/${userName}`, {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export default { addToWishlist, getAllWishlistForUser };
