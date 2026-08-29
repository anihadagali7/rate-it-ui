import axios from "axios";
import AuthClient from "./AuthClient";

jest.mock("axios");

const API_URL = process.env.REACT_APP_BASE_URL;

describe("AuthClient", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("POSTs credentials to the login endpoint without auth headers", () => {
      AuthClient.login("user@example.com", "Password1!");

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/login`, {
        email: "user@example.com",
        password: "Password1!",
      });
    });
  });

  describe("signUp", () => {
    it("POSTs the new account payload to the create-user endpoint", () => {
      const newAccount = { email: "a@b.com", userName: "abc" };

      AuthClient.signUp(newAccount);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/api/create-user`,
        newAccount
      );
    });
  });

  describe("editProfile", () => {
    it("PUTs the updated account using the stored access token", () => {
      localStorage.setItem("accessToken", "jwt-token");
      const editAccount = { firstName: "New" };

      AuthClient.editProfile(editAccount);

      expect(axios.put).toHaveBeenCalledWith(
        `${API_URL}/api/account/update`,
        editAccount,
        { headers: { Authorization: "jwt-token" } }
      );
    });
  });

  describe("resetPassword", () => {
    it("POSTs the password request using the stored access token", () => {
      localStorage.setItem("accessToken", "jwt-token");
      const passwordRequest = {
        currentPassword: "old",
        newPassword: "New1!aaaa",
      };

      AuthClient.resetPassword(passwordRequest);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/api/account/resetPassword`,
        passwordRequest,
        { headers: { Authorization: "jwt-token" } }
      );
    });
  });

  describe("loginWithGoogle", () => {
    it("POSTs the auth code to the Google endpoint without auth headers", () => {
      AuthClient.loginWithGoogle("auth-code");

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/google`, {
        code: "auth-code",
      });
    });
  });

  describe("loginWithFacebook", () => {
    it("POSTs the access token to the Facebook endpoint without auth headers", () => {
      AuthClient.loginWithFacebook("fb-access-token");

      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/api/auth/facebook`,
        { accessToken: "fb-access-token" }
      );
    });
  });

  describe("loginWithApple", () => {
    it("POSTs the identity token and optional name to the Apple endpoint", () => {
      AuthClient.loginWithApple({
        identityToken: "identity-token",
        user: { name: { firstName: "Ali" } },
      });

      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/apple`, {
        identityToken: "identity-token",
        user: { name: { firstName: "Ali" } },
      });
    });
  });

  describe("completeProfile", () => {
    it("PUTs the profile using the stored access token", () => {
      localStorage.setItem("accessToken", "jwt-token");
      const profile = { userName: "newuser" };

      AuthClient.completeProfile(profile);

      expect(axios.put).toHaveBeenCalledWith(
        `${API_URL}/api/account/complete-profile`,
        profile,
        { headers: { Authorization: "jwt-token" } }
      );
    });
  });
});
