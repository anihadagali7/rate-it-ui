import axios from "axios";

const AUTH_FAILURE_MESSAGES = new Set([
  "Token not found",
  "Invalid token",
]);

export const clearAuthSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
};

export const setupAuthInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.errors?.msg;

      if (
        (status === 401 || status === 403) &&
        AUTH_FAILURE_MESSAGES.has(message)
      ) {
        clearAuthSession();

        const path = window.location.pathname;
        if (path !== "/login" && path !== "/signup") {
          window.location.assign("/login");
        }
      }

      return Promise.reject(error);
    }
  );
};
