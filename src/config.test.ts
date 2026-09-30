type ConfigWindow = { __RATE_IT_CONFIG__?: RateItConfig };

const setRuntimeConfig = (config?: RateItConfig) => {
  (window as ConfigWindow).__RATE_IT_CONFIG__ = config;
};

const loadConfig = async () => {
  vi.resetModules();
  return import("./config");
};

describe("config", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_BASE_URL", "https://build-time-api.example.com");
    vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "build-time-google-id");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    setRuntimeConfig(undefined);
  });

  it("uses the values served at page load", async () => {
    setRuntimeConfig({
      VITE_BASE_URL: "https://prod-api.example.com",
      VITE_GOOGLE_CLIENT_ID: "prod-google-id",
    });

    const config = await loadConfig();

    expect(config.BASE_URL).toBe("https://prod-api.example.com");
    expect(config.GOOGLE_CLIENT_ID).toBe("prod-google-id");
  });

  it("falls back to the build-time values when nothing is served", async () => {
    const config = await loadConfig();

    expect(config.BASE_URL).toBe("https://build-time-api.example.com");
    expect(config.GOOGLE_CLIENT_ID).toBe("build-time-google-id");
  });

  it("falls back per key when the served config is empty or partial", async () => {
    setRuntimeConfig({ VITE_BASE_URL: "https://prod-api.example.com" });

    const config = await loadConfig();

    expect(config.BASE_URL).toBe("https://prod-api.example.com");
    expect(config.GOOGLE_CLIENT_ID).toBe("build-time-google-id");
  });
});
