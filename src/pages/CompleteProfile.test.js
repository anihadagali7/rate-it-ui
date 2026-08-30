import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import CompleteProfile from "./CompleteProfile";
import AuthClient from "../client/AuthClient";

jest.mock("../client/AuthClient");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CompleteProfile", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("prefills first and last name from the current user", () => {
    renderWithProviders(<CompleteProfile />, {
      userContextValue: {
        currentUser: { firstName: "Ali", lastName: "Pine" },
      },
    });

    expect(screen.getByDisplayValue("Ali")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pine")).toBeInTheDocument();
  });

  it("disables Finish until a username is entered", () => {
    const { container } = renderWithProviders(<CompleteProfile />);

    expect(screen.getByRole("button", { name: /finish/i })).toBeDisabled();

    fireEvent.change(container.querySelector('input[name="userName"]'), {
      target: { value: "newuser" },
    });

    expect(screen.getByRole("button", { name: /finish/i })).not.toBeDisabled();
  });

  it("does not require a password to submit", async () => {
    AuthClient.completeProfile.mockResolvedValueOnce({
      data: {
        data: {
          user: { userName: "newuser", isProfileComplete: true },
        },
      },
    });

    const { container } = renderWithProviders(<CompleteProfile />);

    fireEvent.change(container.querySelector('input[name="userName"]'), {
      target: { value: "newuser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /finish/i }));

    await waitFor(() =>
      expect(AuthClient.completeProfile).toHaveBeenCalledWith({
        userName: "newuser",
        firstName: "",
        lastName: "",
      })
    );
  });

  it("includes the password when one is provided", async () => {
    AuthClient.completeProfile.mockResolvedValueOnce({
      data: {
        data: {
          user: { userName: "newuser", isProfileComplete: true },
        },
      },
    });

    const { container } = renderWithProviders(<CompleteProfile />);

    fireEvent.change(container.querySelector('input[name="userName"]'), {
      target: { value: "newuser" },
    });
    fireEvent.change(container.querySelector('input[name="password"]'), {
      target: { value: "Password1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /finish/i }));

    await waitFor(() =>
      expect(AuthClient.completeProfile).toHaveBeenCalledWith({
        userName: "newuser",
        firstName: "",
        lastName: "",
        password: "Password1!",
      })
    );
  });

  it("blocks submission and shows an error for a weak password", async () => {
    const { container } = renderWithProviders(<CompleteProfile />);

    fireEvent.change(container.querySelector('input[name="userName"]'), {
      target: { value: "newuser" },
    });
    fireEvent.change(container.querySelector('input[name="password"]'), {
      target: { value: "weak" },
    });
    fireEvent.click(screen.getByRole("button", { name: /finish/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/password should contain at least/i)
      ).toBeInTheDocument()
    );
    expect(AuthClient.completeProfile).not.toHaveBeenCalled();
  });

  it("sets the current user and navigates home on success", async () => {
    const setCurrentUser = jest.fn();
    AuthClient.completeProfile.mockResolvedValueOnce({
      data: {
        data: {
          user: { userName: "newuser", isProfileComplete: true },
        },
      },
    });

    const { container } = renderWithProviders(<CompleteProfile />, {
      userContextValue: { setCurrentUser },
    });

    fireEvent.change(container.querySelector('input[name="userName"]'), {
      target: { value: "newuser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /finish/i }));

    await waitFor(() =>
      expect(setCurrentUser).toHaveBeenCalledWith({
        userName: "newuser",
        isProfileComplete: true,
      })
    );
    expect(localStorage.getItem("userName")).toBe("newuser");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows a server error when the username is already taken", async () => {
    AuthClient.completeProfile.mockRejectedValueOnce({
      response: {
        data: { errors: { msg: "This username is already being used" } },
      },
    });

    const { container } = renderWithProviders(<CompleteProfile />);

    fireEvent.change(container.querySelector('input[name="userName"]'), {
      target: { value: "taken" },
    });
    fireEvent.click(screen.getByRole("button", { name: /finish/i }));

    await waitFor(() =>
      expect(
        screen.getByText("This username is already being used")
      ).toBeInTheDocument()
    );
  });
});
