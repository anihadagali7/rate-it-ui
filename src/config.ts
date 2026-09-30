const runtimeConfig: RateItConfig = window.__RATE_IT_CONFIG__ ?? {};

const read = (key: keyof RateItConfig): string | undefined =>
  runtimeConfig[key] || import.meta.env[key];

export const BASE_URL = read("VITE_BASE_URL");
export const GOOGLE_CLIENT_ID = read("VITE_GOOGLE_CLIENT_ID");
export const FACEBOOK_APP_ID = read("VITE_FACEBOOK_APP_ID");
export const APPLE_CLIENT_ID = read("VITE_APPLE_CLIENT_ID");
export const APPLE_REDIRECT_URI = read("VITE_APPLE_REDIRECT_URI");
