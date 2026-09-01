import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import App from "./App";

jest.mock("axios");

beforeEach(() => {
  axios.get.mockResolvedValue({ data: { data: { ratingsList: [] } } });
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

test("renders the app shell with navigation when logged out", async () => {
  renderApp();

  expect(await screen.findByText("Rate It")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
});

test("does not redirect an already logged-in user away from a password reset link", async () => {
  localStorage.setItem("accessToken", "jwt-token");
  localStorage.setItem("userName", "existinguser");
  window.history.pushState({}, "", "/reset-password?token=abc123");

  axios.get.mockImplementation((url) => {
    if (url.includes("/api/account/existinguser")) {
      return Promise.resolve({
        data: { data: { user: { userName: "existinguser" } } },
      });
    }
    return Promise.resolve({ data: { data: { ratingsList: [] } } });
  });

  renderApp();

  expect(
    await screen.findByText("Choose a new password")
  ).toBeInTheDocument();

  window.history.pushState({}, "", "/");
});

test("resolves the current user via getMe when only an access token is stored (mid social-signup onboarding)", async () => {
  localStorage.setItem("accessToken", "jwt-token");

  axios.get.mockImplementation((url) => {
    if (url.includes("/api/account/me")) {
      return Promise.resolve({
        data: {
          data: {
            user: { firstName: "New", isProfileComplete: false },
          },
        },
      });
    }
    return Promise.resolve({ data: { data: { ratingsList: [] } } });
  });

  renderApp();

  expect(
    await screen.findByText("Finish setting up")
  ).toBeInTheDocument();
});
