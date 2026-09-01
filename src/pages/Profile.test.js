import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Profile from "./Profile";
import AuthClient from "../client/AuthClient";
import UserClient from "../client/UserClient";
import RatingClient from "../client/RatingClient";
import PlaylistClient from "../client/PlaylistClient";
import UserContext from "../shared/context/userContext";

jest.mock("../client/AuthClient");
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
  media: {
    name: "Friends",
    mediaType: "TV",
    mediaId: "1668",
    picture: "https://example.com/friends.jpg",
  },
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
      screen.queryByRole("button", { name: /^following$/i })
    ).not.toBeInTheDocument();
  });

  it("renders the logged-in user's own profile with Edit profile and Add friends actions", async () => {
    mockUserNameParam = "shree";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));

    const { container } = renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Shree Balaji")).toBeInTheDocument();
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

    expect(await screen.findByText("Anirudha Hadagali")).toBeInTheDocument();
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

    fireEvent.click(await screen.findByRole("button", { name: /^following$/i }));

    await waitFor(() =>
      expect(UserClient.unFollowUser).toHaveBeenCalledWith("anihadagali7")
    );
  });

  it("loads the user's ratings in the default Reviews tab", async () => {
    mockUserNameParam = "shree";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
    RatingClient.getAllRatingsForUser.mockResolvedValue(mockRatingsList([rating]));

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("great show")).toBeInTheDocument();
    expect(RatingClient.getAllRatingsForUser).toHaveBeenCalledWith("shree");
  });

  it("switches to the Playlists tab and loads the user's playlists", async () => {
    mockUserNameParam = "shree";
    UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
      mockPlaylistList([playlist])
    );

    renderWithProviders(<Profile />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    await screen.findByText("@shree");
    fireEvent.click(screen.getByRole("button", { name: "Playlists" }));

    expect(await screen.findByText("Favorites")).toBeInTheDocument();
    expect(PlaylistClient.getAllPlaylistForUser).toHaveBeenCalledWith("shree");
  });

  describe("profile picture upload", () => {
    const pngFile = (name = "avatar.png", size = 1024) => {
      const file = new File(["a".repeat(size)], name, { type: "image/png" });
      return file;
    };

    it("shows the change-picture control only on the logged-in user's own profile", async () => {
      mockUserNameParam = "anihadagali7";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(otherProfileNotFollowing));

      renderWithProviders(<Profile />, {
        userContextValue: {
          currentUser: { userName: "shree" },
          setCurrentUser: jest.fn(),
        },
      });

      await screen.findByText("Anirudha Hadagali");
      expect(
        screen.queryByRole("button", { name: /change profile picture/i })
      ).not.toBeInTheDocument();
    });

    it("uploads a selected image and updates the current user's picture", async () => {
      mockUserNameParam = "shree";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
      AuthClient.uploadProfilePicture.mockResolvedValue({
        data: {
          data: { user: { ...ownProfileInfo, picture: "https://example.com/new.png" } },
        },
      });
      const setCurrentUser = jest.fn();

      const { container } = renderWithProviders(<Profile />, {
        userContextValue: {
          currentUser: { userName: "shree" },
          setCurrentUser,
        },
      });

      await screen.findByText("@shree");
      const input = container.querySelector('[data-testid="profile-picture-input"]');
      fireEvent.change(input, { target: { files: [pngFile()] } });

      await waitFor(() =>
        expect(AuthClient.uploadProfilePicture).toHaveBeenCalledWith(
          expect.any(File)
        )
      );
      await waitFor(() => expect(setCurrentUser).toHaveBeenCalled());

      const updater = setCurrentUser.mock.calls[0][0];
      expect(updater({ userName: "shree" })).toEqual({
        userName: "shree",
        picture: "https://example.com/new.png",
      });
      // Guards against resurrecting a logged-out session if the upload
      // resolves after the user has already logged out.
      expect(updater(null)).toBeNull();
    });

    it("rejects a disallowed file type without calling the API", async () => {
      mockUserNameParam = "shree";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));

      const { container } = renderWithProviders(<Profile />, {
        userContextValue: {
          currentUser: { userName: "shree" },
          setCurrentUser: jest.fn(),
        },
      });

      await screen.findByText("@shree");
      const input = container.querySelector('[data-testid="profile-picture-input"]');
      const textFile = new File(["hello"], "notes.txt", { type: "text/plain" });
      fireEvent.change(input, { target: { files: [textFile] } });

      expect(
        await screen.findByText(/please choose a jpeg, png, or webp image/i)
      ).toBeInTheDocument();
      expect(AuthClient.uploadProfilePicture).not.toHaveBeenCalled();
    });

    it("rejects an oversized file without calling the API", async () => {
      mockUserNameParam = "shree";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));

      const { container } = renderWithProviders(<Profile />, {
        userContextValue: {
          currentUser: { userName: "shree" },
          setCurrentUser: jest.fn(),
        },
      });

      await screen.findByText("@shree");
      const input = container.querySelector('[data-testid="profile-picture-input"]');
      const oversized = pngFile("huge.png", 6 * 1024 * 1024);
      fireEvent.change(input, { target: { files: [oversized] } });

      expect(
        await screen.findByText(/please choose an image under 5mb/i)
      ).toBeInTheDocument();
      expect(AuthClient.uploadProfilePicture).not.toHaveBeenCalled();
    });

    it("shows an error message when the upload fails", async () => {
      mockUserNameParam = "shree";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
      AuthClient.uploadProfilePicture.mockRejectedValue({
        response: { data: { errors: { msg: "Could not upload your picture." } } },
      });

      const { container } = renderWithProviders(<Profile />, {
        userContextValue: {
          currentUser: { userName: "shree" },
          setCurrentUser: jest.fn(),
        },
      });

      await screen.findByText("@shree");
      const input = container.querySelector('[data-testid="profile-picture-input"]');
      fireEvent.change(input, { target: { files: [pngFile()] } });

      expect(
        await screen.findByText("Could not upload your picture.")
      ).toBeInTheDocument();
    });

    it("clears a stale picture error when navigating to a different profile", async () => {
      mockUserNameParam = "shree";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(ownProfileInfo));
      AuthClient.uploadProfilePicture.mockRejectedValue({
        response: { data: { errors: { msg: "Could not upload your picture." } } },
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      const buildTree = () => (
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider
            value={{ currentUser: { userName: "shree" }, setCurrentUser: jest.fn() }}
          >
            <MemoryRouter>
              <Profile />
            </MemoryRouter>
          </UserContext.Provider>
        </QueryClientProvider>
      );

      const { container, rerender } = render(buildTree());

      await screen.findByText("@shree");
      const input = container.querySelector('[data-testid="profile-picture-input"]');
      fireEvent.change(input, { target: { files: [pngFile()] } });
      await screen.findByText("Could not upload your picture.");

      mockUserNameParam = "anihadagali7";
      UserClient.getUserInfo.mockResolvedValue(mockUserInfo(otherProfileNotFollowing));
      rerender(buildTree());

      await screen.findByText("Anirudha Hadagali");
      expect(
        screen.queryByText("Could not upload your picture.")
      ).not.toBeInTheDocument();
    });
  });
});
