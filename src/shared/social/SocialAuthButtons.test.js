import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SocialAuthButtons from "./SocialAuthButtons";
import AuthClient from "../../client/AuthClient";
import useFacebookSdk from "../hooks/useFacebookSdk";
import useAppleSdk from "../hooks/useAppleSdk";

jest.mock("../../client/AuthClient");
jest.mock("../hooks/useFacebookSdk");
jest.mock("../hooks/useAppleSdk");

let mockGoogleOnSuccess;
let mockGoogleOnError;

jest.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }) => children,
  useGoogleLogin: (options) => {
    mockGoogleOnSuccess = options.onSuccess;
    mockGoogleOnError = options.onError;
    return jest.fn();
  },
}));

describe("SocialAuthButtons", () => {
  const onSuccess = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useFacebookSdk.mockReturnValue({ login: jest.fn() });
    useAppleSdk.mockReturnValue({ signIn: jest.fn() });
  });

  it("only renders Google by default (Facebook and Apple are temporarily disabled)", () => {
    render(<SocialAuthButtons onSuccess={onSuccess} onError={onError} />);

    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /facebook/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /apple/i })
    ).not.toBeInTheDocument();
  });

  it("renders a button for each provider passed in", () => {
    render(
      <SocialAuthButtons
        onSuccess={onSuccess}
        onError={onError}
        providers={["google", "facebook", "apple"]}
      />
    );

    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /facebook/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apple/i })).toBeInTheDocument();
  });

  it("exchanges the Google auth code and forwards the resulting user", async () => {
    AuthClient.loginWithGoogle.mockResolvedValue({
      data: { accessToken: "jwt-token", data: { user: { userName: "g" } } },
    });

    render(<SocialAuthButtons onSuccess={onSuccess} onError={onError} />);

    await mockGoogleOnSuccess({ code: "auth-code" });

    expect(AuthClient.loginWithGoogle).toHaveBeenCalledWith("auth-code");
    expect(onSuccess).toHaveBeenCalledWith({ userName: "g" }, "jwt-token");
  });

  it("reports a Google popup error", () => {
    render(<SocialAuthButtons onSuccess={onSuccess} onError={onError} />);

    mockGoogleOnError();

    expect(onError).toHaveBeenCalled();
  });

  it("logs in with Facebook and forwards the resulting user", async () => {
    const login = jest.fn().mockResolvedValue("fb-access-token");
    useFacebookSdk.mockReturnValue({ login });
    AuthClient.loginWithFacebook.mockResolvedValue({
      data: { accessToken: "jwt-token", data: { user: { userName: "fb" } } },
    });

    render(
      <SocialAuthButtons
        onSuccess={onSuccess}
        onError={onError}
        providers={["google", "facebook", "apple"]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /facebook/i }));

    await waitFor(() =>
      expect(AuthClient.loginWithFacebook).toHaveBeenCalledWith(
        "fb-access-token"
      )
    );
    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith({ userName: "fb" }, "jwt-token")
    );
  });

  it("signs in with Apple, forwarding the one-time name payload", async () => {
    const signIn = jest.fn().mockResolvedValue({
      authorization: { id_token: "id-token" },
      user: { name: { firstName: "Ali" } },
    });
    useAppleSdk.mockReturnValue({ signIn });
    AuthClient.loginWithApple.mockResolvedValue({
      data: {
        accessToken: "jwt-token",
        data: { user: { userName: "apple-user" } },
      },
    });

    render(
      <SocialAuthButtons
        onSuccess={onSuccess}
        onError={onError}
        providers={["google", "facebook", "apple"]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(AuthClient.loginWithApple).toHaveBeenCalledWith({
        identityToken: "id-token",
        user: { name: { firstName: "Ali" } },
      })
    );
  });

  it("reports an error when a provider sign-in throws", async () => {
    const login = jest.fn().mockRejectedValue(new Error("cancelled"));
    useFacebookSdk.mockReturnValue({ login });

    render(
      <SocialAuthButtons
        onSuccess={onSuccess}
        onError={onError}
        providers={["google", "facebook", "apple"]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /facebook/i }));

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
