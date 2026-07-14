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
});
