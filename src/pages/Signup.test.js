import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Signup from "./Signup";
import AuthClient from "../client/AuthClient";

jest.mock("../client/AuthClient");

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

describe("Signup (logged out)", () => {
  it("renders the sign up form with an editable username and email", () => {
    const { container } = renderWithProviders(<Signup />);

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(
      container.querySelector('input[name="userName"]')
    ).not.toBeDisabled();
    expect(container.querySelector('input[name="email"]')).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("disables Sign Up until all required fields, including password, are filled in", () => {
    const { container } = renderWithProviders(<Signup />);

    expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();

    fillForm(container, validSignupPayload);

    expect(screen.getByRole("button", { name: /sign up/i })).not.toBeDisabled();
  });

  it("blocks submission and shows errors for invalid fields", async () => {
    const { container } = renderWithProviders(<Signup />);

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

    const { container } = renderWithProviders(<Signup />, {
      userContextValue: { setCurrentUser },
    });

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

    const { container } = renderWithProviders(<Signup />);

    fillForm(container, validSignupPayload);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByText("email already in use")).toBeInTheDocument()
    );
  });

  it("links to the login page for existing users", () => {
    renderWithProviders(<Signup />);

    expect(
      screen.getByRole("link", { name: /sign in instead/i })
    ).toHaveAttribute("href", "/login");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
});
