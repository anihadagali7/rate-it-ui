// @vitest-environment node
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  RUNTIME_CONFIG_KEYS,
  buildConfigScript,
  serveConfigScript,
} = require("./runtimeConfig");

const evaluateConfigScript = (script) => {
  const window = {};
  new Function("window", script)(window);
  return window.__RATE_IT_CONFIG__;
};

describe("runtimeConfig", () => {
  it("exposes only the allowed client keys", () => {
    const script = buildConfigScript({
      VITE_BASE_URL: "https://rate-it-service-prod.herokuapp.com",
      VITE_GOOGLE_CLIENT_ID: "google-id",
      MONGO_DB_HOST: "mongodb://secret",
      JWT_SECRET: "secret",
      PATH: "/usr/bin",
    });

    expect(evaluateConfigScript(script)).toEqual({
      VITE_BASE_URL: "https://rate-it-service-prod.herokuapp.com",
      VITE_GOOGLE_CLIENT_ID: "google-id",
    });
    expect(script).not.toContain("secret");
  });

  it("omits unset or empty keys so the build-time value applies", () => {
    const script = buildConfigScript({ VITE_BASE_URL: "" });

    expect(evaluateConfigScript(script)).toEqual({});
  });

  it("JSON-encodes values so they can't break out of the script", () => {
    const value = `x"; alert(1); "`;
    const script = buildConfigScript({ VITE_APPLE_REDIRECT_URI: value });

    expect(evaluateConfigScript(script)).toEqual({
      VITE_APPLE_REDIRECT_URI: value,
    });
  });

  it("covers every client config key", () => {
    expect(RUNTIME_CONFIG_KEYS).toEqual([
      "VITE_BASE_URL",
      "VITE_GOOGLE_CLIENT_ID",
      "VITE_FACEBOOK_APP_ID",
      "VITE_APPLE_CLIENT_ID",
      "VITE_APPLE_REDIRECT_URI",
    ]);
  });

  it("serves the script as uncached JavaScript", () => {
    const response = {
      set: vi.fn(),
      type: vi.fn(),
      send: vi.fn(),
    };

    serveConfigScript({ VITE_BASE_URL: "https://api.example.com" })(
      {},
      response
    );

    expect(response.set).toHaveBeenCalledWith("Cache-Control", "no-store");
    expect(response.type).toHaveBeenCalledWith("application/javascript");
    expect(evaluateConfigScript(response.send.mock.calls[0][0])).toEqual({
      VITE_BASE_URL: "https://api.example.com",
    });
  });
});
