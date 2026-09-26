import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import ResetPassword from "./ResetPassword";
import AuthClient from "../../client/AuthClient";

vi.mock("../../client/AuthClient");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const fillForm = (container, values) => {
  Object.entries(values).forEach(([name, value]) => {
    fireEvent.change(container.querySelector(`input[name="${name}"]`), {
      target: { value },
    });
  });
};

const currentUser = { userName: "johndoe" };

describe("ResetPassword", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("disables reset until all password fields are filled in", () => {
    const { container } = renderWithProviders(<ResetPassword />, {
      userContextValue: { currentUser },
    });

    expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();

    fillForm(container, {
      currentPassword: "OldPass1!",
      newPassword: "NewPass1!",
      confirmNewPassword: "NewPass1!",
    });

    expect(screen.getByRole("button", { name: /reset/i })).not.toBeDisabled();
  });

  it("shows validation errors for a weak new password and mismatched confirmation", async () => {
    const { container } = renderWithProviders(<ResetPassword />, {
      userContextValue: { currentUser },
    });

    fillForm(container, {
      currentPassword: "OldPass1!",
      newPassword: "weak",
      confirmNewPassword: "different",
    });
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/password should contain at least/i)
      ).toBeInTheDocument()
    );
    expect(screen.getByText("Passwords are not equal")).toBeInTheDocument();
    expect(AuthClient.resetPassword).not.toHaveBeenCalled();
  });

  it("submits the current and new password and navigates to the profile on success", async () => {
    AuthClient.resetPassword.mockResolvedValueOnce({});

    const { container } = renderWithProviders(<ResetPassword />, {
      userContextValue: { currentUser },
    });

    fillForm(container, {
      currentPassword: "OldPass1!",
      newPassword: "NewPass1!",
      confirmNewPassword: "NewPass1!",
    });
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    await waitFor(() =>
      expect(AuthClient.resetPassword).toHaveBeenCalledWith({
        currentPassword: "OldPass1!",
        newPassword: "NewPass1!",
      })
    );
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/profile/johndoe")
    );
  });

  it("flags the current password field when the server rejects it", async () => {
    AuthClient.resetPassword.mockRejectedValueOnce({
      response: {
        data: { errors: { msg: "Current password is not valid" } },
      },
    });

    const { container } = renderWithProviders(<ResetPassword />, {
      userContextValue: { currentUser },
    });

    fillForm(container, {
      currentPassword: "WrongPass1!",
      newPassword: "NewPass1!",
      confirmNewPassword: "NewPass1!",
    });
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    await waitFor(() =>
      expect(
        screen.getAllByText("Current password is not valid").length
      ).toBeGreaterThan(0)
    );
  });
});
