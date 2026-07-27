import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import LikeButton from "./LikeButton";

describe("LikeButton", () => {
  it("renders the initial count and unlike label by default", () => {
    render(<LikeButton initialCount={3} />);

    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("optimistically toggles liked state and count", async () => {
    const onToggle = jest.fn().mockResolvedValue(undefined);
    render(
      <LikeButton initialCount={1} initialLiked={false} onToggle={onToggle} />
    );

    fireEvent.click(screen.getByRole("button", { name: /^like$/i }));

    expect(screen.getByRole("button", { name: /unlike/i })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true));
  });

  it("rolls back when onToggle rejects", async () => {
    const onToggle = jest.fn().mockRejectedValue(new Error("failed"));
    render(
      <LikeButton initialCount={4} initialLiked={true} onToggle={onToggle} />
    );

    fireEvent.click(screen.getByRole("button", { name: /unlike/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /unlike/i })).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  it("does not toggle when disabled", () => {
    const onToggle = jest.fn();
    render(
      <LikeButton initialCount={0} disabled onToggle={onToggle} />
    );

    fireEvent.click(screen.getByRole("button", { name: /like/i }));

    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
