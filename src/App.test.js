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
