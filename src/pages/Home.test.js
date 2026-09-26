import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Home from "./Home";
import RatingClient from "../client/RatingClient";

jest.mock("../client/RatingClient");

const exploreRating = (id, name, comment) => ({
  _id: id,
  media: {
    name,
    mediaType: "TV",
    mediaId: `id-${id}`,
    picture: "https://example.com/poster.jpg",
  },
  ratedBy: {
    userName: "anihadagali7",
    firstName: "Anirudha",
    lastName: "Hadagali",
  },
  rating: "10",
  comments: comment,
  dateCreated: "2022-09-23T09:05:40.853Z",
});

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

    expect(
      container.querySelectorAll(".MuiSkeleton-root").length
    ).toBeGreaterThan(0);
    expect(screen.queryByText("Discover")).not.toBeInTheDocument();
  });

  it("shows the discover feed for a logged-out user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([
        exploreRating("e1", "Better Call Saul", "slippin jimmy"),
      ])
    );

    renderWithProviders(<Home />);

    expect(await screen.findByText("slippin jimmy")).toBeInTheDocument();
    expect(screen.getByText("Better Call Saul")).toBeInTheDocument();
    expect(screen.queryByText("Following")).not.toBeInTheDocument();
    expect(RatingClient.getFeedRatings).not.toHaveBeenCalled();
  });

  it("shows following feed by default for a logged in user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([
        exploreRating("e1", "Better Call Saul", "slippin jimmy"),
      ])
    );
    RatingClient.getFeedRatings.mockResolvedValue(
      mockRatingsList([feedRating])
    );

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Following")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("great show")).toBeInTheDocument();
    expect(screen.queryByText("slippin jimmy")).not.toBeInTheDocument();
  });

  it("defaults to Discover when a logged in user's following feed is empty", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([
        exploreRating("e1", "Better Call Saul", "slippin jimmy"),
      ])
    );
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "newuser" } },
    });

    expect(await screen.findByText("slippin jimmy")).toBeInTheDocument();
    expect(screen.queryByText("Your feed is empty")).not.toBeInTheDocument();
  });

  it("still shows the empty following state if the user switches back to it", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([
        exploreRating("e1", "Better Call Saul", "slippin jimmy"),
      ])
    );
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "newuser" } },
    });

    await screen.findByText("slippin jimmy");
    fireEvent.click(screen.getByText("Following"));

    expect(await screen.findByText("Your feed is empty")).toBeInTheDocument();
  });

  it("shows discover ratings when a logged in user switches tabs", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([
        exploreRating("e1", "Better Call Saul", "slippin jimmy"),
      ])
    );
    RatingClient.getFeedRatings.mockResolvedValue(
      mockRatingsList([feedRating])
    );

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("great show")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Discover"));

    expect(await screen.findByText("slippin jimmy")).toBeInTheDocument();
    expect(screen.queryByText("great show")).not.toBeInTheDocument();
  });

  it("shows an empty state when discover has no ratings for a logged in user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(mockRatingsList([]));
    RatingClient.getFeedRatings.mockResolvedValue(
      mockRatingsList([feedRating])
    );

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(await screen.findByText("Discover"));

    expect(
      await screen.findByText("Nothing new to discover")
    ).toBeInTheDocument();
  });

  it("paginates the discover feed and loads more ratings on scroll", async () => {
    const ratings = Array.from({ length: 12 }, (_, index) =>
      exploreRating(`e${index}`, `Show ${index}`, `review ${index}`)
    );

    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList(ratings)
    );

    renderWithProviders(<Home />);

    expect(await screen.findByText("review 0")).toBeInTheDocument();
    expect(screen.getByText("review 9")).toBeInTheDocument();
    expect(screen.queryByText("review 10")).not.toBeInTheDocument();
  });

  it("shows an error message when explore ratings fail to load", async () => {
    RatingClient.getAllExploreRatings.mockRejectedValue(
      new Error("Network error")
    );

    renderWithProviders(<Home />);

    expect(
      await screen.findByText("Unable to load explore ratings.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });
});
