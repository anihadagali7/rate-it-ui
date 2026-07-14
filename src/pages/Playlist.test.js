import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Playlist from "./Playlist";
import PlaylistClient from "../client/PlaylistClient";

jest.mock("../client/PlaylistClient");

let mockUserNameParam = "shree";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ userName: mockUserNameParam }),
}));

const playlist = (id, name) => ({ _id: id, name, posters: [] });

beforeEach(() => {
  PlaylistClient.getAllPlaylistForUser.mockResolvedValue({
    data: { data: { playlistList: [playlist("p1", "Favorites")] } },
  });
});

describe("Playlist", () => {
  it("shows a Create button when viewing your own playlists and creates a new one", async () => {
    mockUserNameParam = "shree";
    PlaylistClient.createPlaylist.mockResolvedValue({});

    renderWithProviders(<Playlist />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    expect(await screen.findByText("Favorites")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(
      await screen.findByText("Add new playlist for shree")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "New year watchlist" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(PlaylistClient.createPlaylist).toHaveBeenCalledWith({
        playlistName: "New year watchlist",
      })
    );
  });

  it("hides the Create button when viewing someone else's playlists", async () => {
    mockUserNameParam = "anihadagali7";

    renderWithProviders(<Playlist />, {
      userContextValue: { currentUser: { userName: "shree" } },
    });

    await screen.findByText("Playlist");
    expect(
      screen.queryByRole("button", { name: /create/i })
    ).not.toBeInTheDocument();
  });
});
