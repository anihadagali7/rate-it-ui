import type { AxiosRequestConfig } from "axios";

export const getHeaders = (): AxiosRequestConfig => {
  const accessToken = localStorage.getItem("accessToken");
  return { headers: accessToken ? { Authorization: accessToken } : {} };
};
