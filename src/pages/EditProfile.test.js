import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import EditProfile from "./EditProfile";
import AuthClient from "../client/AuthClient";

vi.mock("../client/AuthClient");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const currentUser = {
  firstName: "Jane",
  lastName: "Doe",
  userName: "janedoe",
  email: "jane@example.com",
  phoneNumber: "1234567890",
};

describe("EditProfile", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Edit profile form pre-filled with the current user, with username and email locked", () => {
    const { container } = renderWithProviders(<EditProfile />, {
      userContextValue: { currentUser },
    });

    expect(screen.getByText("Edit profile")).toBeInTheDocument();
    expect(container.querySelector('input[name="firstName"]')).toHaveValue(
      "Jane"
    );
    expect(container.querySelector('input[name="userName"]')).toHaveValue(
      "janedoe"
    );
    expect(container.querySelector('input[name="userName"]')).toBeDisabled();
    expect(container.querySelector('input[name="email"]')).toBeDisabled();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("disables Save until a field actually changes", () => {
    const { container } = renderWithProviders(<EditProfile />, {
      userContextValue: { currentUser },
    });

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();

    fireEvent.change(container.querySelector('input[name="firstName"]'), {
      target: { value: "Janet" },
    });

    expect(screen.getByRole("button", { name: /save/i })).not.toBeDisabled();
  });

  it("saves changes and navigates to the user's profile", async () => {
    const setCurrentUser = vi.fn();
    AuthClient.editProfile.mockResolvedValueOnce({
      data: { data: { user: { ...currentUser, firstName: "Janet" } } },
    });

    const { container } = renderWithProviders(<EditProfile />, {
      userContextValue: { currentUser, setCurrentUser },
    });

    fireEvent.change(container.querySelector('input[name="firstName"]'), {
      target: { value: "Janet" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(AuthClient.editProfile).toHaveBeenCalledWith({
        firstName: "Janet",
        lastName: "Doe",
        phoneNumber: "1234567890",
      })
    );
    expect(setCurrentUser).toHaveBeenCalledWith({
      ...currentUser,
      firstName: "Janet",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/profile/janedoe");
  });

  it("switches to the reset password view", () => {
    renderWithProviders(<EditProfile />, {
      userContextValue: { currentUser },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(screen.getByText("Reset password")).toBeInTheDocument();
  });
});
