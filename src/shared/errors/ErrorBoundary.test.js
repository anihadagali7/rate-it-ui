import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const BrokenComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Boom");
  }

  return <div>Healthy content</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Healthy content")).toBeInTheDocument();
  });

  it("renders a fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("Healthy content")).not.toBeInTheDocument();
  });

  it("resets after the user clicks try again", () => {
    let shouldThrow = true;
    const MaybeBroken = () => {
      if (shouldThrow) {
        throw new Error("Boom");
      }

      return <div>Healthy content</div>;
    };

    render(
      <ErrorBoundary>
        <MaybeBroken />
      </ErrorBoundary>
    );

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByText("Healthy content")).toBeInTheDocument();
  });
});
