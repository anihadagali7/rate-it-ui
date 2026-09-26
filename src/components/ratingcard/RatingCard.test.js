import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import CommentClient from "../../client/CommentClient";
import LikeClient from "../../client/LikeClient";
import RatingCard from "./RatingCard";

vi.mock("../../client/LikeClient");
vi.mock("../../client/CommentClient");

const rating = {
  _id: "rating-1",
  media: {
    name: "Succession",
    mediaType: "TV",
    mediaId: "76331",
    picture: "https://example.com/poster.jpg",
  },
  ratedBy: {
    userName: "anihadagali7",
    firstName: "Anirudha",
    lastName: "Hadagali",
  },
  rating: "10",
  comments: "incredible show",
  dateCreated: "2024-06-10T18:03:58.946Z",
  likeCount: 2,
  likedByCurrentUser: false,
  commentCount: 1,
  commentList: [
    {
      _id: "c1",
      text: "Spot on",
      dateCreated: "2024-06-11T12:00:00.000Z",
      likeCount: 1,
      likedByCurrentUser: false,
      commentedBy: {
        userName: "shree",
        firstName: "Shree",
        lastName: "Balaji",
      },
    },
  ],
};

describe("RatingCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the like count without requiring login just to view it", () => {
    renderWithProviders(<RatingCard rating={rating} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("prompts login instead of liking when logged out", async () => {
    renderWithProviders(<RatingCard rating={rating} />);

    // RatingCard's own like button is first in the DOM; the comment
    // thread's per-comment like button (also named "Like") is mounted too
    // even while the thread is visually collapsed, so index into the list
    // rather than assuming there's a single match.
    const [ratingLikeButton] = screen.getAllByRole("button", {
      name: /^like$/i,
    });
    fireEvent.click(ratingLikeButton);

    // LikeButton's own revert-on-reject behavior is already covered by
    // LikeButton.test.js; this just confirms RatingCard prompts login
    // instead of calling the like API.
    expect(
      await screen.findByText("Please login to get the full experience!")
    ).toBeInTheDocument();
    expect(LikeClient.likeRating).not.toHaveBeenCalled();
  });

  it("prompts login when trying to comment while logged out", async () => {
    renderWithProviders(<RatingCard rating={rating} />);

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /sign in to leave a comment/i })
    );

    expect(
      await screen.findByText("Please login to get the full experience!")
    ).toBeInTheDocument();
  });

  it("prompts login when trying to like a comment while logged out", async () => {
    renderWithProviders(<RatingCard rating={rating} />);

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));

    const likeButtons = screen.getAllByRole("button", { name: /^like$/i });
    // First is the rating's like button; second is the comment's.
    fireEvent.click(likeButtons[1]);

    expect(
      await screen.findByText("Please login to get the full experience!")
    ).toBeInTheDocument();
    expect(CommentClient.likeComment).not.toHaveBeenCalled();
  });

  it("likes a rating when signed in", async () => {
    LikeClient.likeRating.mockResolvedValue({});

    renderWithProviders(<RatingCard rating={rating} />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /^like$/i }));

    await waitFor(() =>
      expect(LikeClient.likeRating).toHaveBeenCalledWith("rating-1")
    );
    expect(screen.getByRole("button", { name: /unlike/i })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("unlikes a rating when already liked", async () => {
    LikeClient.unlikeRating.mockResolvedValue({});

    renderWithProviders(
      <RatingCard
        rating={{ ...rating, likedByCurrentUser: true, likeCount: 5 }}
      />,
      {
        userContextValue: { currentUser: { userName: "shree" } },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /unlike/i }));

    await waitFor(() =>
      expect(LikeClient.unlikeRating).toHaveBeenCalledWith("rating-1")
    );
    expect(screen.getByRole("button", { name: /^like$/i })).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("adds a comment when signed in", async () => {
    CommentClient.addComment.mockResolvedValue({});

    renderWithProviders(<RatingCard rating={rating} />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    expect(screen.getByText("Spot on")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/write a comment/i), {
      target: { value: "Totally agree" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^post$/i }));

    await waitFor(() =>
      expect(CommentClient.addComment).toHaveBeenCalledWith(
        "rating-1",
        "Totally agree"
      )
    );
  });

  it("deletes the current user's comment", async () => {
    CommentClient.deleteComment.mockResolvedValue({});

    renderWithProviders(<RatingCard rating={rating} />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));
    fireEvent.click(screen.getByRole("button", { name: /delete comment/i }));

    await waitFor(() =>
      expect(CommentClient.deleteComment).toHaveBeenCalledWith("c1")
    );
  });

  it("likes a comment when signed in", async () => {
    CommentClient.likeComment.mockResolvedValue({});

    renderWithProviders(<RatingCard rating={rating} />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /1 comment/i }));

    const likeButtons = screen.getAllByRole("button", { name: /^like$/i });
    // First is rating like; second is comment like
    fireEvent.click(likeButtons[1]);

    await waitFor(() =>
      expect(CommentClient.likeComment).toHaveBeenCalledWith("c1")
    );
  });
});
