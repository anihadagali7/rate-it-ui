import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Profile from "./Profile";
import UserClient from "../client/UserClient";
import RatingClient from "../client/RatingClient";
import PlaylistClient from "../client/PlaylistClient";

jest.mock("../client/UserClient");
jest.mock("../client/RatingClient");
jest.mock("../client/PlaylistClient");
jest.mock("../client/WishlistClient");

let mockUserNameParam = "shree";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ userName: mockUserNameParam }),
}));

const ownProfileInfo = {
  userName: "shree",
  firstName: "Shree",
  lastName: "Balaji",
  following: ["anihadagali7"],
  followers: ["anihadagali7", "kangaru17"],
};

const otherProfileNotFollowing = {
  userName: "anihadagali7",
  firstName: "Anirudha",
  lastName: "Hadagali",
  following: [],
  followers: [],
};

const otherProfileFollowing = {
  ...otherProfileNotFollowing,
  followers: ["shree"],
};

const rating = {
  _id: "r1",
  media: { name: "Friends", mediaType: "TV", mediaId: "1668" },
  ratedBy: { userName: "anihadagali7", firstName: "Anirudha", lastName: "Hadagali" },
  rating: "9",
  comments: "great show",
  dateCreated: "2024-06-10T18:03:58.946Z",
};

const playlist = { _id: "p1", name: "Favorites", posters: [] };

const mockUserInfo = (user) => ({ data: { data: { user } } });
const mockRatingsList = (ratings) => ({ data: { data: { ratingsList: ratings } } });
const mockPlaylistList = (playlists) => ({ data: { data: { playlistList: playlists } } });

beforeEach(() => {
  RatingClient.getAllRatingsForUser.mockResolvedValue(mockRatingsList([]));
  PlaylistClient.getAllPlaylistForUser.mockResolvedValue(mockPlaylistList([]));
});

describe("Profile", () => {
  it("does not render a Follow/Following action button before the profile has loaded", () => {
    mockUserNameParam = "anihadagali7";
    UserClient.getUserInfo.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(
      screen.queryByRole("button", { name: /^follow$/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /following/i })
    ).not.toBeInTheDocument();
  });

  it("renders the logged-in user's own profile with Edit profile and Add friends actions", async () => {
    mockUserNameParam = "shree";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));

    const { container } = renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Shree")).toBeInTheDocument();
    expect(screen.getByText("@shree")).toBeInTheDocument();
    expect(container).toHaveTextContent("1 following");
    expect(container).toHaveTextContent("2 followers");
    expect(
      screen.getByRole("link", { name: /edit profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add friends/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^follow$/i })
    ).not.toBeInTheDocument();
  });

  it("hides the Add friends action and shows Follow when viewing another user who isn't followed", async () => {
    mockUserNameParam = "anihadagali7";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(otherProfileNotFollowing));

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Anirudha")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add friends/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^follow$/i })
    ).toBeInTheDocument();
  });

  it("follows a profile that isn't followed yet", async () => {
    mockUserNameParam = "anihadagali7";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(otherProfileNotFollowing));
    UserClient.followUser.mockResolvedValue({});

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(await screen.findByRole("button", { name: /^follow$/i }));

    await waitFor(() =>
      expect(UserClient.followUser).toHaveBeenCalledWith("anihadagali7")
    );
  });

  it("unfollows a profile that is already followed", async () => {
    mockUserNameParam = "anihadagali7";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(otherProfileFollowing));
    UserClient.unFollowUser.mockResolvedValue({});

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    fireEvent.click(await screen.findByRole("button", { name: /following/i }));

    await waitFor(() =>
      expect(UserClient.unFollowUser).toHaveBeenCalledWith("anihadagali7")
    );
  });

  it("loads the user's ratings in the default Ratings tab", async () => {
    mockUserNameParam = "shree";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
    RatingClient.getAllRatingsForUser.mockResolvedValue(mockRatingsList([rating]));

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Comments: great show")).toBeInTheDocument();
    expect(RatingClient.getAllRatingsForUser).toHaveBeenCalledWith("shree");
  });

  it("switches to the Playlist tab and loads the user's playlists", async () => {
    mockUserNameParam = "shree";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
      mockPlaylistList([playlist])
    );

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    await screen.findByText("@shree");
    fireEvent.click(screen.getByRole("tab", { name: "Playlist" }));

    expect(await screen.findByText("Favorites")).toBeInTheDocument();
    expect(PlaylistClient.getAllPlaylistForUser).toHaveBeenCalledWith("shree");
  });
});
