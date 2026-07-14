import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Protected from "./Protected";
import UserContext from "./context/userContext";

const renderProtected = (currentUser) =>
  render(
    <UserContext.Provider value={{ currentUser }}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
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

describe("Protected", () => {
  it("renders the protected children when a current user is present", () => {
    renderProtected({ userName: "johndoe" });

    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });

  it("redirects to home when there is no current user", () => {
    renderProtected(null);

    expect(screen.getByText("Home page")).toBeInTheDocument();
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });
});
