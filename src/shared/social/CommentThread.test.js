import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import CommentThread from "./CommentThread";

const comments = [
  {
    _id: "c1",
    text: "Agreed!",
    dateCreated: "2024-06-11T12:00:00.000Z",
    commentedBy: {
      userName: "shree",
      firstName: "Shree",
      lastName: "Balaji",
    },
  },
];

describe("CommentThread", () => {
  it("shows the comment count and expands the thread", () => {
    renderWithProviders(<CommentThread comments={comments} commentCount={1} />);

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));

    expect(screen.getByText("Agreed!")).toBeInTheDocument();
    expect(screen.getByText(/sign in to leave a comment/i)).toBeInTheDocument();
  });

  it("prompts login when a logged-out visitor tries to comment", () => {
    const onRequireAuth = vi.fn();

    renderWithProviders(
      <CommentThread
        comments={comments}
        commentCount={1}
        onRequireAuth={onRequireAuth}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /sign in to leave a comment/i })
    );

    expect(onRequireAuth).toHaveBeenCalled();
  });

  it("prompts login when a logged-out visitor tries to like a comment", async () => {
    const onRequireAuth = vi.fn();
    const onToggleLike = vi.fn();

    renderWithProviders(
      <CommentThread
        comments={[{ ...comments[0], likeCount: 2, likedByCurrentUser: false }]}
        commentCount={1}
        onToggleLike={onToggleLike}
        onRequireAuth={onRequireAuth}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    fireEvent.click(screen.getByRole("button", { name: /^like$/i }));

    // LikeButton's own revert-on-reject behavior is already covered by
    // LikeButton.test.js; this just confirms the auth prompt fires instead
    // of the real toggle callback.
    await waitFor(() => expect(onRequireAuth).toHaveBeenCalled());
    expect(onToggleLike).not.toHaveBeenCalled();
  });

  it("posts a comment when signed in", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <CommentThread
        comments={[]}
        commentCount={0}
        currentUser={{ userName: "shree" }}
        onAdd={onAdd}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /0 comments/i }));
    fireEvent.change(screen.getByPlaceholderText(/write a comment/i), {
      target: { value: "Nice review" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^post$/i }));

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith("Nice review"));
  });

  it("lets the author delete their comment", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <CommentThread
        comments={comments}
        commentCount={1}
        currentUser={{ userName: "shree" }}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    fireEvent.click(screen.getByRole("button", { name: /delete comment/i }));

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith("c1"));
  });

  it("toggles a comment like", async () => {
    const onToggleLike = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <CommentThread
        comments={[
          {
            ...comments[0],
            likeCount: 2,
            likedByCurrentUser: false,
          },
        ]}
        commentCount={1}
        currentUser={{ userName: "shree" }}
        onToggleLike={onToggleLike}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    fireEvent.click(screen.getByRole("button", { name: /^like$/i }));

    await waitFor(() => expect(onToggleLike).toHaveBeenCalledWith("c1", true));
  });
});
