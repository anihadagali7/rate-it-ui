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
    expect(screen.getByAltText("poster")).toHaveAttribute(
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

  it("renders user reviews when ratings exist", async () => {
    const { container } = renderWithProviders(<MediaInfo />);

    await screen.findByText("User reviews");

    const reviewItem = container.querySelector(".MuiListItem-root");
    expect(reviewItem).toHaveTextContent("Anirudha Hadagali");
    expect(reviewItem).toHaveTextContent("@anihadagali7");
    expect(reviewItem).toHaveTextContent("Rating: 9");
    expect(reviewItem).toHaveTextContent("Comments: great story");
  });

  it("does not render a reviews section when there are no ratings", async () => {
    RatingClient.getAllRatingsForMedia.mockResolvedValue({
      data: { status: "success", data: { ratingsList: [] } },
    });

    renderWithProviders(<MediaInfo />);

    await screen.findByRole("heading", { name: "Succession" });
    expect(screen.queryByText("User reviews")).not.toBeInTheDocument();
  });

  it("navigates back when Return is clicked", async () => {
    renderWithProviders(<MediaInfo />);
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /return/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("adds the media to the wishlist", async () => {
    WishlistClient.addToWishlist.mockResolvedValue({});
    renderWithProviders(<MediaInfo />);
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /add to wishlist/i }));

    await waitFor(() =>
      expect(WishlistClient.addToWishlist).toHaveBeenCalledWith({
        mediaId: "76331",
      })
    );
  });

  it("opens the add rating modal and submits a rating", async () => {
    RatingClient.submitRating.mockResolvedValue({});
    renderWithProviders(<MediaInfo />);
    await screen.findByRole("heading", { name: "Succession" });

    fireEvent.click(screen.getByRole("button", { name: /add rating/i }));

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

    expect(await screen.findByText("Add to playlist")).toBeInTheDocument();
    expect(await screen.findByText("Favorites")).toBeInTheDocument();
  });
});
