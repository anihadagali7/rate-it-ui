import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Wishlist from "./Wishlist";
import WishlistClient from "../client/WishlistClient";

jest.mock("../client/WishlistClient");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ userName: "anihadagali7" }),
}));

const makeWishlistItem = (id, name, mediaId) => ({
  _id: id,
  media: { name, mediaType: "TV", mediaId },
  addedBy: {
    userName: "anihadagali7",
    firstName: "Anirudha",
    lastName: "Hadagali",
  },
  dateCreated: "2024-01-01T00:00:00.000Z",
});

describe("Wishlist", () => {
  it("renders the page heading and the full wishlist for the given user", async () => {
    WishlistClient.getAllWishlistForUser.mockResolvedValue({
      data: {
        data: {
          wishlistList: [
            makeWishlistItem("w1", "Succession", "76331"),
            makeWishlistItem("w2", "Friends", "1668"),
            makeWishlistItem("w3", "Shutter Island", "11324"),
            makeWishlistItem("w4", "Mr. Robot", "62560"),
          ],
        },
      },
    });

    renderWithProviders(<Wishlist />);

    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(await screen.findByText("Mr. Robot")).toBeInTheDocument();
    expect(WishlistClient.getAllWishlistForUser).toHaveBeenCalledWith(
      "anihadagali7"
    );
    expect(
      screen.queryByRole("link", { name: /see all wishlists/i })
    ).not.toBeInTheDocument();
  });
});
