// Client config that scripts/heroku-start.js serves as /config.js, so a build promoted
// between Heroku apps picks up each app's own values. Everything listed here is sent to
// the browser: never add a secret.
const RUNTIME_CONFIG_KEYS = [
  "VITE_BASE_URL",
  "VITE_GOOGLE_CLIENT_ID",
  "VITE_FACEBOOK_APP_ID",
  "VITE_APPLE_CLIENT_ID",
  "VITE_APPLE_REDIRECT_URI",
];

const buildConfigScript = (env) => {
  const config = {};
  RUNTIME_CONFIG_KEYS.forEach((key) => {
    if (env[key]) {
      config[key] = env[key];
    }
  });
  return `window.__RATE_IT_CONFIG__ = ${JSON.stringify(config)};\n`;
};

const serveConfigScript = (env) => (request, response) => {
  response.set("Cache-Control", "no-store");
  response.type("application/javascript");
  response.send(buildConfigScript(env));
};

module.exports = { RUNTIME_CONFIG_KEYS, buildConfigScript, serveConfigScript };
