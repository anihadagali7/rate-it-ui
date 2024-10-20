import axios from "axios";
import { getHeaders } from "../utils/AuthorizationUtils";

const API_URL = process.env.REACT_APP_BASE_URL;

export default class RatingClient {
  static submitRating(rating) {
    const url = `${API_URL}/api/rating`;
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

// const submitRating = (rating) => {
//   return axios
//     .post(API_URL + `/api/rating`, rating, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const getAllRatingsForUser = (userName) => {
//   return axios
//     .get(API_URL + `/api/ratings/user/${userName}`, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const getAllRatingsForMedia = (mediaId) => {
//   return axios
//     .get(API_URL + `/api/ratings/media/${mediaId}`, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// const getAllExploreRatings= () => {
//   return axios
//     .get(API_URL + `/api/ratings/explore`, {})
//     .then((response) => {
//       return response.data;
//     });
// };

// const getFeedRatings= (userName) => {
//   return axios
//     .get(API_URL + `/api/ratings/following/${userName}`, {
//       headers: {
//         Authorization: ACCESS_TOKEN,
//       },
//     })
//     .then((response) => {
//       return response.data;
//     });
// };