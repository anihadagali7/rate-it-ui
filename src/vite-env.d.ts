/// <reference types="vite/client" />

// Client config: set per Heroku app and served as /config.js by
// scripts/heroku-start.js, or compiled in from .env when that isn't present.
interface RateItConfig {
  readonly VITE_BASE_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  readonly VITE_APPLE_CLIENT_ID?: string;
  readonly VITE_APPLE_REDIRECT_URI?: string;
}

interface ImportMetaEnv extends RateItConfig {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  readonly __RATE_IT_CONFIG__?: RateItConfig;
}
