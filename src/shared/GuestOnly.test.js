import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import GuestOnly from "./GuestOnly";
import UserContext from "./context/userContext";

const renderGuestOnly = (currentUser, { accessToken = null } = {}) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }

  return render(
    <UserContext.Provider value={{ currentUser }}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <div>Login page</div>
              </GuestOnly>
            }
          />
        </Routes>
      </MemoryRouter>
    </UserContext.Provider>
  );
};

describe("GuestOnly", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("renders guest pages when there is no current user", () => {
    renderGuestOnly(null);

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects signed-in users to home", () => {
    renderGuestOnly({ userName: "johndoe" }, { accessToken: "test-token" });

    expect(screen.getByText("Home page")).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });
});
