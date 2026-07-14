import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Login from "./Login";
import AuthClient from "../client/AuthClient";

jest.mock("../client/AuthClient");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fillForm = (container, { email, password }) => {
  if (email !== undefined) {
    fireEvent.change(container.querySelector('input[name="email"]'), {
      target: { value: email },
    });
  }
  if (password !== undefined) {
    fireEvent.change(container.querySelector('input[name="password"]'), {
      target: { value: password },
    });
  }
};

describe("Login", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("disables the sign in button until email and password are filled in", () => {
    const { container } = renderWithProviders(<Login />);

    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();

    fillForm(container, { email: "user@example.com", password: "Password1!" });

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).not.toBeDisabled();
  });

  it("shows a validation error and does not submit for an invalid email", async () => {
    const { container } = renderWithProviders(<Login />);

    fillForm(container, { email: "not-an-email", password: "Password1!" });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Value should be a valid email.")
      ).toBeInTheDocument()
    );
    expect(AuthClient.login).not.toHaveBeenCalled();
  });

  it("logs in, stores the access token, sets the current user, and navigates home on success", async () => {
    const setCurrentUser = jest.fn();
    AuthClient.login.mockResolvedValueOnce({
      data: {
        accessToken: "jwt-token",
        data: { user: { userName: "johndoe" } },
      },
    });

    const { container } = renderWithProviders(<Login />, {
      userContextValue: { setCurrentUser },
    });

    fillForm(container, { email: "user@example.com", password: "Password1!" });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(setCurrentUser).toHaveBeenCalledWith({ userName: "johndoe" })
    );
    expect(AuthClient.login).toHaveBeenCalledWith(
      "user@example.com",
      "Password1!"
    );
    expect(localStorage.getItem("accessToken")).toBe("jwt-token");
    expect(localStorage.getItem("userName")).toBe("johndoe");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows a server-provided error message when login fails", async () => {
    AuthClient.login.mockRejectedValueOnce({
      response: { data: { errors: { msg: "Invalid credentials" } } },
    });

    const { container } = renderWithProviders(<Login />);

    fillForm(container, { email: "user@example.com", password: "Password1!" });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
