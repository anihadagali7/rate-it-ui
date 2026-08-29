import { getHeaders } from "./AuthorizationUtils";

describe("getHeaders", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("returns the stored access token as the Authorization header", () => {
    localStorage.setItem("accessToken", "test-token-123");

    expect(getHeaders()).toEqual({
      headers: { Authorization: "test-token-123" },
    });
  });

  it("omits the Authorization header when no access token is stored", () => {
    expect(getHeaders()).toEqual({
      headers: {},
    });
  });
});
