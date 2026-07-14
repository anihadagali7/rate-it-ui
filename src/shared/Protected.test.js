import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Protected from "./Protected";
import UserContext from "./context/userContext";

const renderProtected = (currentUser, { accessToken = "test-token" } = {}) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }

  return render(
    <UserContext.Provider value={{ currentUser }}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/" element={<div>Home page</div>} />
          <Route
            path="/protected"
            element={
              <Protected>
                <div>Secret content</div>
              </Protected>
            }
          />
        </Routes>
      </MemoryRouter>
    </UserContext.Provider>
  );
};

describe("Protected", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("renders the protected children when a current user and token are present", () => {
    renderProtected({ userName: "johndoe" });

    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });

  it("redirects to login when there is no current user", () => {
    renderProtected(null);

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });

  it("redirects to login when there is no access token", () => {
    renderProtected({ userName: "johndoe" }, { accessToken: null });

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });
});
