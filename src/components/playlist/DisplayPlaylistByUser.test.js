import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import DisplayPlaylistByUser from "./DisplayPlaylistByUser";
import PlaylistClient from "../../client/PlaylistClient";

jest.mock("../../client/PlaylistClient");

const playlist = (id, name) => ({ _id: id, name, posters: [] });

const mockPlaylistResponse = (playlistList) => ({
  data: { data: { playlistList } },
});

describe("DisplayPlaylistByUser", () => {
  it("renders the user's playlists", async () => {
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
      mockPlaylistResponse([playlist("p1", "Movies to watch"), playlist("p2", "Favorites")])
    );

    renderWithProviders(
      <DisplayPlaylistByUser userName="anihadagali7" profileView={false} />
    );

    expect(await screen.findByText("Movies to watch")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /see all playlists/i })
    ).not.toBeInTheDocument();
    expect(PlaylistClient.getAllPlaylistForUser).toHaveBeenCalledWith(
      "anihadagali7"
    );
  });

  it("limits to 3 playlists and shows a See all playlists link in profile view", async () => {
    PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
      mockPlaylistResponse([
        playlist("p1", "Movies to watch"),
        playlist("p2", "Favorites"),
        playlist("p3", "TV Shows"),
        playlist("p4", "Rewatch"),
      ])
    );

    renderWithProviders(
      <DisplayPlaylistByUser userName="anihadagali7" profileView={true} />
    );

    // select() reverses the list, so the most recently returned 3 are shown
    expect(await screen.findByText("Rewatch")).toBeInTheDocument();
    expect(screen.getByText("TV Shows")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.queryByText("Movies to watch")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /see all playlists/i })
    ).toHaveAttribute("href", "/playlist/anihadagali7");
  });

  it("does not fetch playlists when no userName is provided", () => {
    renderWithProviders(
      <DisplayPlaylistByUser userName={undefined} profileView={false} />
    );

    expect(PlaylistClient.getAllPlaylistForUser).not.toHaveBeenCalled();
  });
});
