import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import ProfileDetails from "./ProfileDetails";
import AuthClient from "../../client/AuthClient";

jest.mock("../../client/AuthClient");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const fillForm = (container, values) => {
  Object.entries(values).forEach(([name, value]) => {
    fireEvent.change(container.querySelector(`input[name="${name}"]`), {
      target: { value },
    });
  });
};

const validSignupPayload = {
  firstName: "Jane",
  lastName: "Doe",
  userName: "janedoe",
  phoneNumber: "1234567890",
  email: "jane@example.com",
  password: "Password1!",
};

describe("ProfileDetails - sign up", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("disables Sign Up until all required fields, including password, are filled in", () => {
    const { container } = renderWithProviders(
      <ProfileDetails createProfile updateProfile={false} />
    );

    expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();

    fillForm(container, validSignupPayload);

    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).not.toBeDisabled();
  });

  it("blocks submission and shows errors for invalid fields", async () => {
    const { container } = renderWithProviders(
      <ProfileDetails createProfile updateProfile={false} />
    );

    fillForm(container, {
      ...validSignupPayload,
      email: "not-an-email",
      userName: "ab",
      phoneNumber: "123",
      password: "weak",
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Value should be a valid email.")
      ).toBeInTheDocument()
    );
    expect(
      screen.getByText("Value must be at least 4 characters.")
    ).toBeInTheDocument();
    expect(screen.getByText("Value should be 10 digits.")).toBeInTheDocument();
    expect(
      screen.getByText(/password should contain at least/i)
    ).toBeInTheDocument();
    expect(AuthClient.signUp).not.toHaveBeenCalled();
  });

  it("signs up, stores the access token, sets the current user, and navigates home", async () => {
    const setCurrentUser = jest.fn();
    AuthClient.signUp.mockResolvedValueOnce({
      data: {
        accessToken: "jwt-token",
        data: { user: { userName: "janedoe" } },
      },
    });

    const { container } = renderWithProviders(
      <ProfileDetails createProfile updateProfile={false} />,
      { userContextValue: { setCurrentUser } }
    );

    fillForm(container, validSignupPayload);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(AuthClient.signUp).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "1234567890",
        email: "jane@example.com",
        userName: "janedoe",
        password: "Password1!",
      })
    );
    expect(localStorage.getItem("accessToken")).toBe("jwt-token");
    expect(setCurrentUser).toHaveBeenCalledWith({ userName: "janedoe" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("flags the relevant field when the server reports a duplicate email or username", async () => {
    AuthClient.signUp.mockRejectedValueOnce({
      response: { data: { errors: { msg: "email already in use" } } },
    });

    const { container } = renderWithProviders(
      <ProfileDetails createProfile updateProfile={false} />
    );

    fillForm(container, validSignupPayload);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByText("email already in use")).toBeInTheDocument()
    );
  });
});

describe("ProfileDetails - edit profile", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const currentUser = {
    firstName: "Jane",
    lastName: "Doe",
    userName: "janedoe",
    email: "jane@example.com",
    phoneNumber: "1234567890",
  };

  it("disables Save until a field actually changes", () => {
    const { container } = renderWithProviders(
      <ProfileDetails createProfile={false} updateProfile />,
      { userContextValue: { currentUser } }
    );

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();

    fireEvent.change(container.querySelector('input[name="firstName"]'), {
      target: { value: "Janet" },
    });

    expect(screen.getByRole("button", { name: /save/i })).not.toBeDisabled();
  });

  it("saves changes and navigates to the user's profile", async () => {
    const setCurrentUser = jest.fn();
    AuthClient.editProfile.mockResolvedValueOnce({
      data: { data: { user: { ...currentUser, firstName: "Janet" } } },
    });

    const { container } = renderWithProviders(
      <ProfileDetails createProfile={false} updateProfile />,
      { userContextValue: { currentUser, setCurrentUser } }
    );

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
    renderWithProviders(
      <ProfileDetails createProfile={false} updateProfile />,
      { userContextValue: { currentUser } }
    );

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(screen.getByText("Reset password")).toBeInTheDocument();
  });
});
