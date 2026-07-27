import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import LikeClient from "../../client/LikeClient";
import RatingCard from "./RatingCard";

jest.mock("../../client/LikeClient");

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
};

describe("RatingCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows like count and disables likes when logged out", () => {
    renderWithProviders(<RatingCard rating={rating} />);

    const likeButton = screen.getByRole("button", { name: /like/i });
    expect(likeButton).toBeDisabled();
    expect(screen.getByText("2")).toBeInTheDocument();
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
});
