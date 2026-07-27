import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import MediaInfo from "./MediaInfo";
import MediaClient from "../client/MediaClient";
import RatingClient from "../client/RatingClient";
import WishlistClient from "../client/WishlistClient";
import PlaylistClient from "../client/PlaylistClient";
import mediaInfoResponse from "../mockdata/media_info.json";
import ratingsResponse from "../mockdata/ratings_media.json";

jest.mock("../client/MediaClient");
jest.mock("../client/RatingClient");
jest.mock("../client/WishlistClient");
jest.mock("../client/PlaylistClient");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ mediaType: "tv", id: "76331" }),
}));

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  MediaClient.getMediaInfoDetails.mockResolvedValue({ data: mediaInfoResponse });
  RatingClient.getAllRatingsForMedia.mockResolvedValue({ data: ratingsResponse });
  WishlistClient.getAllWishlistForUser.mockResolvedValue({
    data: { data: { wishlistList: [] } },
  });
});

describe("MediaInfo", () => {
  it("shows a loading skeleton while media details are being fetched", () => {
    MediaClient.getMediaInfoDetails.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(<MediaInfo />);

    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);
    expect(screen.queryByText("Succession")).not.toBeInTheDocument();
  });

  it("renders media details once loaded", async () => {
    renderWithProviders(<MediaInfo />);

    expect(
      await screen.findByRole("heading", { name: "Succession" })
    ).toBeInTheDocument();
    expect(screen.getAllByAltText("Succession")[0]).toHaveAttribute(
      "src",
      mediaInfoResponse.data.media.picture
    );
    expect(screen.getByText(/Roy family/)).toBeInTheDocument();
    expect(screen.getByText(/Jeremy Strong/)).toHaveTextContent(
      "Cast: Jeremy Strong, Sarah Snook, Kieran Culkin, Brian Cox"
    );
    expect(screen.queryByText(/Director:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Producer:/)).not.toBeInTheDocument();
  });

  it("renders community reviews when ratings exist", async () => {
    renderWithProviders(<MediaInfo />);

    expect(await screen.findByText("Community reviews (1)")).toBeInTheDocument();
    expect(screen.getByText("Anirudha Hadagali")).toBeInTheDocument();
    expect(screen.getByText("great story")).toBeInTheDocument();
  });

  it("shows an empty reviews state when there are no ratings", async () => {
    RatingClient.getAllRatingsForMedia.mockResolvedValue({
      data: { status: "success", data: { ratingsList: [] } },
    });

    renderWithProviders(<MediaInfo />);

    expect(await screen.findByRole("heading", { name: "Succession" })).toBeInTheDocument();
    expect(screen.queryByText(/community reviews/i)).not.toBeInTheDocument();
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("navigates back when Back is clicked", async () => {
    renderWithProviders(<MediaInfo />);
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("adds the media to the wishlist", async () => {
    WishlistClient.addToWishlist.mockResolvedValue({});
    renderWithProviders(<MediaInfo />, {
      userContextValue: { currentUser: { userName: "janedoe" } },
    });
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /add to wishlist/i }));

    await waitFor(() =>
      expect(WishlistClient.addToWishlist).toHaveBeenCalledWith({
        mediaId: "76331",
      })
    );
    expect(
      await screen.findByText("Succession saved to your wishlist")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /saved to wishlist/i })
    ).toBeInTheDocument();
  });

  it("removes the media from the wishlist when already saved", async () => {
    WishlistClient.getAllWishlistForUser.mockResolvedValue({
      data: {
        data: {
          wishlistList: [
            {
              _id: "w1",
              media: { mediaId: "76331", name: "Succession", mediaType: "TV" },
            },
          ],
        },
      },
    });
    WishlistClient.removeFromWishlist.mockResolvedValue({});

    renderWithProviders(<MediaInfo />, {
      userContextValue: { currentUser: { userName: "janedoe" } },
    });
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(
      await screen.findByRole("button", { name: /saved to wishlist/i })
    );

    await waitFor(() =>
      expect(WishlistClient.removeFromWishlist).toHaveBeenCalledWith("76331")
    );
    expect(
      await screen.findByText("Succession removed from your wishlist")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to wishlist/i })
    ).toBeInTheDocument();
  });

  it("opens the add rating modal and submits a rating", async () => {
    RatingClient.submitRating.mockResolvedValue({});
    renderWithProviders(<MediaInfo />, {
      userContextValue: { currentUser: { userName: "janedoe" } },
    });
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /^rate$/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Succession");

    fireEvent.change(within(dialog).getByRole("textbox"), {
      target: { value: "Loved it" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(RatingClient.submitRating).toHaveBeenCalledWith({
        mediaId: "76331",
        comments: "Loved it",
        rating: 5,
      })
    );
    expect(
      await screen.findByText("You rated Succession 5/10")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /rated 5\/10/i })
    ).toBeDisabled();
  });

  it("disables the rate button when the user already rated the media", async () => {
    RatingClient.getAllRatingsForMedia.mockResolvedValue({
      data: {
        data: {
          ratingsList: [
            {
              ...ratingsResponse.data.ratingsList[0],
              ratedBy: {
                ...ratingsResponse.data.ratingsList[0].ratedBy,
                userName: "janedoe",
              },
              rating: 8,
            },
          ],
        },
      },
    });

    renderWithProviders(<MediaInfo />, {
      userContextValue: { currentUser: { userName: "janedoe" } },
    });
    await screen.findByRole("heading", { name: "Succession" });

    expect(
      await screen.findByRole("button", { name: /rated 8\/10/i })
    ).toBeDisabled();
  });

  it("opens the add to playlist dialog and lists the user's playlists", async () => {
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue({
      data: { data: { playlistList: [{ _id: "p1", name: "Favorites" }] } },
    });
    PlaylistClient.getPlaylistsWithThisMedia.mockResolvedValue({
      data: { data: { selectedPlaylists: [] } },
    });

    renderWithProviders(<MediaInfo />, {
      userContextValue: { currentUser: { userName: "janedoe" } },
    });
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /add to playlist/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Add to playlist");
    expect(await within(dialog).findByText("Favorites")).toBeInTheDocument();
  });
});
