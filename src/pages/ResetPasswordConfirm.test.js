import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import ResetPasswordConfirm from "./ResetPasswordConfirm";
import AuthClient from "../client/AuthClient";

jest.mock("../client/AuthClient");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fillForm = (container, { newPassword, confirmNewPassword }) => {
  if (newPassword !== undefined) {
    fireEvent.change(container.querySelector('input[name="newPassword"]'), {
      target: { value: newPassword },
    });
  }
  if (confirmNewPassword !== undefined) {
    fireEvent.change(
      container.querySelector('input[name="confirmNewPassword"]'),
      { target: { value: confirmNewPassword } }
    );
  }
};

describe("ResetPasswordConfirm", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("shows an invalid-link state and no form when there is no token in the URL", () => {
    const { container } = renderWithProviders(<ResetPasswordConfirm />, {
      route: "/reset-password",
    });

    expect(screen.getByText("Invalid link")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /request a new link/i })
    ).toHaveAttribute("href", "/forgot-password");
    expect(
      container.querySelector('input[name="newPassword"]')
    ).not.toBeInTheDocument();
  });

  it("shows a validation error and does not submit for a weak password", async () => {
    const { container } = renderWithProviders(<ResetPasswordConfirm />, {
      route: "/reset-password?token=abc123",
    });

    fillForm(container, { newPassword: "weak", confirmNewPassword: "weak" });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/password should contain at least/i)
      ).toBeInTheDocument()
    );
    expect(AuthClient.resetPasswordWithToken).not.toHaveBeenCalled();
  });

  it("shows a validation error when the passwords don't match", async () => {
    const { container } = renderWithProviders(<ResetPasswordConfirm />, {
      route: "/reset-password?token=abc123",
    });

    fillForm(container, {
      newPassword: "NewPassword1!",
      confirmNewPassword: "Different1!",
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() =>
      expect(screen.getByText("Passwords should be equal")).toBeInTheDocument()
    );
    expect(AuthClient.resetPasswordWithToken).not.toHaveBeenCalled();
  });

  it("resets the password, logs the user in, and navigates home on success", async () => {
    const setCurrentUser = jest.fn();
    AuthClient.resetPasswordWithToken.mockResolvedValueOnce({
      data: {
        accessToken: "jwt-token",
        data: { user: { userName: "johndoe" } },
      },
    });

    const { container } = renderWithProviders(<ResetPasswordConfirm />, {
      route: "/reset-password?token=abc123",
      userContextValue: { setCurrentUser },
    });

    fillForm(container, {
      newPassword: "NewPassword1!",
      confirmNewPassword: "NewPassword1!",
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() =>
      expect(AuthClient.resetPasswordWithToken).toHaveBeenCalledWith(
        "abc123",
        "NewPassword1!"
      )
    );
    expect(localStorage.getItem("accessToken")).toBe("jwt-token");
    expect(localStorage.getItem("userName")).toBe("johndoe");
    expect(setCurrentUser).toHaveBeenCalledWith({ userName: "johndoe" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows the server error message when the token is invalid or expired", async () => {
    AuthClient.resetPasswordWithToken.mockRejectedValueOnce({
      response: {
        data: {
          errors: { msg: "This password reset link is invalid or has expired" },
        },
      },
    });

    const { container } = renderWithProviders(<ResetPasswordConfirm />, {
      route: "/reset-password?token=bad-token",
    });

    fillForm(container, {
      newPassword: "NewPassword1!",
      confirmNewPassword: "NewPassword1!",
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(
      await screen.findByText(
        "This password reset link is invalid or has expired"
      )
    ).toBeInTheDocument();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
