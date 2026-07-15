import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Home from "./Home";
import RatingClient from "../client/RatingClient";

jest.mock("../client/RatingClient");

const exploreRating = {
  _id: "e1",
  media: {
    name: "Better Call Saul",
    mediaType: "TV",
    mediaId: "60059",
    picture: "https://example.com/poster.jpg",
  },
  ratedBy: {
    userName: "anihadagali7",
    firstName: "Anirudha",
    lastName: "Hadagali",
  },
  rating: "10",
  comments: "slippin jimmy",
  dateCreated: "2022-09-23T09:05:40.853Z",
};

const feedRating = {
  _id: "f1",
  media: {
    name: "Friends",
    mediaType: "TV",
    mediaId: "1668",
    picture: "https://example.com/friends.jpg",
  },
  ratedBy: { userName: "shree", firstName: "Shree", lastName: "Balaji" },
  rating: "9",
  comments: "great show",
  dateCreated: "2024-06-10T18:03:58.946Z",
};

const mockRatingsList = (ratings) => ({
  data: { status: "success", data: { ratingsList: ratings } },
});

describe("Home", () => {
  it("shows a loading skeleton while explore ratings are loading", () => {
    RatingClient.getAllExploreRatings.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(<Home />);

    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);
    expect(screen.queryByText("Discover")).not.toBeInTheDocument();
  });

  it("shows the discover feed for a logged-out user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([exploreRating])
    );

    renderWithProviders(<Home />);

    expect(await screen.findByText("slippin jimmy")).toBeInTheDocument();
    expect(screen.getByText("Better Call Saul")).toBeInTheDocument();
    expect(screen.queryByText("Following")).not.toBeInTheDocument();
    expect(RatingClient.getFeedRatings).not.toHaveBeenCalled();
  });

  it("shows following feed by default for a logged in user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([exploreRating])
    );
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([feedRating]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Following")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("great show")).toBeInTheDocument();
    expect(screen.queryByText("slippin jimmy")).not.toBeInTheDocument();
  });

  it("shows an empty state when the following feed has no ratings", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([exploreRating])
    );
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Your feed is empty")).toBeInTheDocument();
    expect(screen.queryByText("slippin jimmy")).not.toBeInTheDocument();
  });

  it("shows an error message when explore ratings fail to load", async () => {
    RatingClient.getAllExploreRatings.mockRejectedValue(new Error("Network error"));

    renderWithProviders(<Home />);

    expect(
      await screen.findByText("Unable to load explore ratings.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
