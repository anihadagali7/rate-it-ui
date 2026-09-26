import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import DisplayWishlistByUser from "./DisplayWishlistByUser";
import WishlistClient from "../../client/WishlistClient";

vi.mock("../../client/WishlistClient");

const makeWishlistItem = (id, name, mediaId) => ({
  _id: id,
  media: {
    name,
    mediaType: "TV",
    mediaId,
    picture: "https://example.com/poster.jpg",
  },
  addedBy: {
    userName: "anihadagali7",
    firstName: "Anirudha",
    lastName: "Hadagali",
  },
  dateCreated: "2024-01-01T00:00:00.000Z",
});

const mockWishlistResponse = (wishlistList) => ({
  data: { data: { wishlistList } },
});

describe("DisplayWishlistByUser", () => {
  it("shows a loading skeleton while the wishlist is being fetched", () => {
    WishlistClient.getAllWishlistForUser.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <DisplayWishlistByUser userName="anihadagali7" />
    );

    expect(
      container.querySelectorAll(".MuiSkeleton-root").length
    ).toBeGreaterThan(0);
  });

  it("renders the user's wishlist items", async () => {
    WishlistClient.getAllWishlistForUser.mockResolvedValue(
      mockWishlistResponse([
        makeWishlistItem("w1", "Succession", "76331"),
        makeWishlistItem("w2", "Friends", "1668"),
      ])
    );

    renderWithProviders(<DisplayWishlistByUser userName="anihadagali7" />);

    expect(await screen.findByText("Succession")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(WishlistClient.getAllWishlistForUser).toHaveBeenCalledWith(
      "anihadagali7"
    );
  });

  it("shows an empty state when the wishlist has no items", async () => {
    WishlistClient.getAllWishlistForUser.mockResolvedValue(
      mockWishlistResponse([])
    );

    renderWithProviders(<DisplayWishlistByUser userName="anihadagali7" />);

    expect(await screen.findByText("Wishlist is empty")).toBeInTheDocument();
  });

  it("does not fetch a wishlist when no userName is provided", () => {
    renderWithProviders(<DisplayWishlistByUser userName={undefined} />);

    expect(WishlistClient.getAllWishlistForUser).not.toHaveBeenCalled();
  });

  it("shows remove controls on your own wishlist and removes an item", async () => {
    WishlistClient.getAllWishlistForUser.mockResolvedValue(
      mockWishlistResponse([makeWishlistItem("w1", "Succession", "76331")])
    );
    WishlistClient.removeFromWishlist.mockResolvedValue({});
    const onRemoved = vi.fn();

    renderWithProviders(
      <DisplayWishlistByUser userName="anihadagali7" onRemoved={onRemoved} />,
      { userContextValue: { currentUser: { userName: "anihadagali7" } } }
    );

    fireEvent.click(
      await screen.findByRole("button", {
        name: /remove succession from wishlist/i,
      })
    );

    await waitFor(() =>
      expect(WishlistClient.removeFromWishlist).toHaveBeenCalledWith("76331")
    );
    expect(onRemoved).toHaveBeenCalledWith("76331");
  });

  it("hides remove controls when viewing someone else's wishlist", async () => {
    WishlistClient.getAllWishlistForUser.mockResolvedValue(
      mockWishlistResponse([makeWishlistItem("w1", "Succession", "76331")])
    );

    renderWithProviders(<DisplayWishlistByUser userName="anihadagali7" />, {
      userContextValue: { currentUser: { userName: "someoneelse" } },
    });

    expect(await screen.findByText("Succession")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remove succession from wishlist/i })
    ).not.toBeInTheDocument();
  });
});
