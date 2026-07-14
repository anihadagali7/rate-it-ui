import { render, screen, fireEvent } from "@testing-library/react";
import QueryErrorState from "./QueryErrorState";

describe("QueryErrorState", () => {
  it("renders the default error message", () => {
    render(<QueryErrorState />);

    expect(
      screen.getByText("Something went wrong while loading this content.")
    ).toBeInTheDocument();
  });

  it("renders a custom message and retry button", () => {
    const onRetry = jest.fn();

    render(
      <QueryErrorState
        message="Unable to load explore ratings."
        onRetry={onRetry}
      />
    );

    expect(screen.getByText("Unable to load explore ratings.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
