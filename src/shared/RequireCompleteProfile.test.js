import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequireCompleteProfile from "./RequireCompleteProfile";
import UserContext from "./context/userContext";

const renderGuard = (currentUser, { route = "/" } = {}) => {
  return render(
    <UserContext.Provider value={{ currentUser }}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route
            path="/complete-profile"
            element={<div>Complete profile page</div>}
          />
          <Route
            path="*"
            element={
              <RequireCompleteProfile>
                <div>App content</div>
              </RequireCompleteProfile>
            }
          />
        </Routes>
      </MemoryRouter>
    </UserContext.Provider>
  );
};

describe("RequireCompleteProfile", () => {
  it("redirects an incomplete profile away from other routes", () => {
    renderGuard({ isProfileComplete: false }, { route: "/" });

    expect(screen.getByText("Complete profile page")).toBeInTheDocument();
    expect(screen.queryByText("App content")).not.toBeInTheDocument();
  });

  it("does not redirect once already on /complete-profile, avoiding a loop", () => {
    renderGuard(
      { isProfileComplete: false },
      { route: "/complete-profile" }
    );

    expect(screen.getByText("Complete profile page")).toBeInTheDocument();
  });

  it("renders normally for a user with a complete profile", () => {
    renderGuard({ isProfileComplete: true }, { route: "/" });

    expect(screen.getByText("App content")).toBeInTheDocument();
  });

  it("renders normally for a logged-out user", () => {
    renderGuard(null, { route: "/" });

    expect(screen.getByText("App content")).toBeInTheDocument();
  });
});
