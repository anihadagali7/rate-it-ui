import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import ForgotPassword from "./ForgotPassword";
import AuthClient from "../client/AuthClient";

vi.mock("../client/AuthClient");

describe("ForgotPassword", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("disables the submit button until an email is entered", () => {
    renderWithProviders(<ForgotPassword />);

    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "user@example.com" },
    });

    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).not.toBeDisabled();
  });

  it("shows a validation error and does not submit for an invalid email", async () => {
    renderWithProviders(<ForgotPassword />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Value should be a valid email.")
      ).toBeInTheDocument()
    );
    expect(AuthClient.forgotPassword).not.toHaveBeenCalled();
  });

  it("shows the generic success message on submit, regardless of whether the account exists", async () => {
    AuthClient.forgotPassword.mockResolvedValueOnce({
      data: { data: { msg: "generic" } },
    });

    renderWithProviders(<ForgotPassword />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/we've sent a link/i)).toBeInTheDocument();
    expect(AuthClient.forgotPassword).toHaveBeenCalledWith("user@example.com");
  });

  it("shows an error message if the request itself fails", async () => {
    AuthClient.forgotPassword.mockRejectedValueOnce(new Error("network error"));

    renderWithProviders(<ForgotPassword />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(
      await screen.findByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
  });
});
