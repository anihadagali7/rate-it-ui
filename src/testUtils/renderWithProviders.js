import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContext from "../shared/context/userContext";

export const renderWithProviders = (
  ui,
  { userContextValue = {}, route = "/" } = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userContextValue}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};
