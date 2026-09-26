import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import DisplayPlaylistByUser from "./DisplayPlaylistByUser";
import PlaylistClient from "../../client/PlaylistClient";

vi.mock("../../client/PlaylistClient");

const playlist = (id, name) => ({ _id: id, name, posters: [] });

const mockPlaylistResponse = (playlistList) => ({
  data: { data: { playlistList } },
});

describe("DisplayPlaylistByUser", () => {
  it("renders the user's playlists", async () => {
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
      mockPlaylistResponse([
        playlist("p1", "Movies to watch"),
        playlist("p2", "Favorites"),
      ])
    );

    renderWithProviders(<DisplayPlaylistByUser userName="anihadagali7" />);

    expect(await screen.findByText("Movies to watch")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(PlaylistClient.getAllPlaylistForUser).toHaveBeenCalledWith(
      "anihadagali7"
    );
  });

  it("shows an empty state when there are no playlists", async () => {
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
      mockPlaylistResponse([])
    );

    renderWithProviders(<DisplayPlaylistByUser userName="anihadagali7" />);

    expect(await screen.findByText("No playlists yet")).toBeInTheDocument();
  });

  it("does not fetch playlists when no userName is provided", () => {
    renderWithProviders(<DisplayPlaylistByUser userName={undefined} />);

    expect(PlaylistClient.getAllPlaylistForUser).not.toHaveBeenCalled();
  });
});
