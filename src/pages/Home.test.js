import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Home from "./Home";
import RatingClient from "../client/RatingClient";

jest.mock("../client/RatingClient");

const exploreRating = {
  _id: "e1",
  media: { name: "Better Call Saul", mediaType: "TV", mediaId: "60059" },
  ratedBy: { userName: "anihadagali7", firstName: "Anirudha", lastName: "Hadagali" },
  rating: "10",
  comments: "slippin jimmy",
  dateCreated: "2022-09-23T09:05:40.853Z",
};

const feedRating = {
  _id: "f1",
  media: { name: "Friends", mediaType: "TV", mediaId: "1668" },
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
    expect(screen.queryByText("Explore")).not.toBeInTheDocument();
  });

  it("shows only the Explore section for a logged-out user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([exploreRating])
    );

    renderWithProviders(<Home />);

    expect(await screen.findByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Comments: slippin jimmy")).toBeInTheDocument();
    expect(screen.queryByText("For you")).not.toBeInTheDocument();
    expect(RatingClient.getFeedRatings).not.toHaveBeenCalled();
  });

  it("shows both For you and Explore sections for a logged in user", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([exploreRating])
    );
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([feedRating]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("For you")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Comments: great show")).toBeInTheDocument();
    expect(screen.getByText("Comments: slippin jimmy")).toBeInTheDocument();
  });

  it("hides the For you section when the feed has no ratings", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(
      mockRatingsList([exploreRating])
    );
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Explore")).toBeInTheDocument();
    expect(screen.queryByText("For you")).not.toBeInTheDocument();
  });

  it("hides the Explore section when there are no explore ratings", async () => {
    RatingClient.getAllExploreRatings.mockResolvedValue(mockRatingsList([]));
    RatingClient.getFeedRatings.mockResolvedValue(mockRatingsList([feedRating]));

    renderWithProviders(<Home />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("For you")).toBeInTheDocument();
    expect(screen.queryByText("Explore")).not.toBeInTheDocument();
  });
});
