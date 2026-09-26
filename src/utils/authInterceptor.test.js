import axios from "axios";
import { clearAuthSession, setupAuthInterceptor } from "./authInterceptor";

vi.mock("axios", () => ({
  default: {
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

describe("authInterceptor", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    axios.interceptors.response.use.mockClear();
    delete window.location;
    window.location = { pathname: "/", assign: vi.fn() };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("clears the auth session", () => {
    localStorage.setItem("accessToken", "token");
    localStorage.setItem("userName", "ani");

    clearAuthSession();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("userName")).toBeNull();
  });

  it("registers a response interceptor that clears session on auth failures", async () => {
    setupAuthInterceptor();

    expect(axios.interceptors.response.use).toHaveBeenCalledTimes(1);
    const onRejected = axios.interceptors.response.use.mock.calls[0][1];

    localStorage.setItem("accessToken", "token");
    localStorage.setItem("userName", "ani");

    await expect(
      onRejected({
        response: {
          status: 403,
          data: { errors: { msg: "Invalid token" } },
        },
      })
    ).rejects.toBeDefined();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("userName")).toBeNull();
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });

  it("does not redirect anonymous requests that never had a session", async () => {
    setupAuthInterceptor();
    const onRejected = axios.interceptors.response.use.mock.calls[0][1];

    await expect(
      onRejected({
        response: {
          status: 403,
          data: { errors: { msg: "Invalid token" } },
        },
      })
    ).rejects.toBeDefined();

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("does not clear the session for login credential errors", async () => {
    setupAuthInterceptor();
    const onRejected = axios.interceptors.response.use.mock.calls[0][1];

    localStorage.setItem("accessToken", "token");

    await expect(
      onRejected({
        response: {
          status: 401,
          data: { errors: { msg: "Email or password is invalid" } },
        },
      })
    ).rejects.toBeDefined();

    expect(localStorage.getItem("accessToken")).toBe("token");
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
