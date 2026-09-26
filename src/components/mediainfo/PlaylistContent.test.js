import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import PlaylistContent from "./PlaylistContent";
import PlaylistClient from "../../client/PlaylistClient";

vi.mock("../../client/PlaylistClient");

const playlist = (id, name) => ({ _id: id, name });

const mockAllPlaylists = (playlists) => ({
  data: { data: { playlistList: playlists } },
});

const mockPlaylistsWithMedia = (playlists) => ({
  data: { data: { selectedPlaylists: playlists } },
});

const renderPlaylistContent = (props = {}) =>
  renderWithProviders(
    <PlaylistContent
      mediaId="media-1"
      onClose={vi.fn()}
      handleNewPlaylistModalOpen={vi.fn()}
      {...props}
    />,
    { userContextValue: { currentUser: { userName: "shree" } } }
  );

beforeEach(() => {
  PlaylistClient.getAllPlaylistForUser.mockResolvedValue(
    mockAllPlaylists([
      playlist("p1", "Movies to watch"),
      playlist("p2", "Favorites"),
      playlist("p3", "TV Shows"),
    ])
  );
  PlaylistClient.getPlaylistsWithThisMedia.mockResolvedValue(
    mockPlaylistsWithMedia([playlist("p2", "Favorites")])
  );
});

describe("PlaylistContent", () => {
  it("lists the user's playlists and pre-selects the ones already containing the media", async () => {
    renderPlaylistContent();

    expect(await screen.findByText("Movies to watch")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: "Favorites" })).toBeChecked()
    );
    expect(
      screen.getByRole("checkbox", { name: "Movies to watch" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "TV Shows" })
    ).not.toBeChecked();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("filters the playlist list via the search field", async () => {
    renderPlaylistContent();

    await screen.findByText("Movies to watch");
    fireEvent.change(screen.getByPlaceholderText(/search your playlists/i), {
      target: { value: "tv" },
    });

    expect(screen.getByText("TV Shows")).toBeInTheDocument();
    expect(screen.queryByText("Movies to watch")).not.toBeInTheDocument();
    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
  });

  it("adds the media to a newly selected playlist on save", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    PlaylistClient.addMediaToMultiplePlaylists.mockResolvedValue({});
    renderPlaylistContent({ onClose, onSuccess });

    fireEvent.click(await screen.findByRole("checkbox", { name: "TV Shows" }));
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(PlaylistClient.addMediaToMultiplePlaylists).toHaveBeenCalledWith({
        mediaId: "media-1",
        playlistsToAdd: ["p3"],
        playlistsToRemove: [],
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalledWith({
      playlistsToAdd: ["p3"],
      playlistsToRemove: [],
    });
  });

  it("removes the media from a deselected playlist on save", async () => {
    PlaylistClient.addMediaToMultiplePlaylists.mockResolvedValue({});
    renderPlaylistContent();

    const favoritesCheckbox = await screen.findByRole("checkbox", {
      name: "Favorites",
    });
    await waitFor(() => expect(favoritesCheckbox).toBeChecked());

    fireEvent.click(favoritesCheckbox);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(PlaylistClient.addMediaToMultiplePlaylists).toHaveBeenCalledWith({
        mediaId: "media-1",
        playlistsToAdd: [],
        playlistsToRemove: ["p2"],
      })
    );
  });

  it("enables Save and sends the correct diff when swapping one playlist for another", async () => {
    PlaylistClient.addMediaToMultiplePlaylists.mockResolvedValue({});
    renderPlaylistContent();

    const favoritesCheckbox = await screen.findByRole("checkbox", {
      name: "Favorites",
    });
    await waitFor(() => expect(favoritesCheckbox).toBeChecked());

    fireEvent.click(favoritesCheckbox);
    fireEvent.click(screen.getByRole("checkbox", { name: "TV Shows" }));

    expect(screen.getByRole("button", { name: /save/i })).not.toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(PlaylistClient.addMediaToMultiplePlaylists).toHaveBeenCalledWith({
        mediaId: "media-1",
        playlistsToAdd: ["p3"],
        playlistsToRemove: ["p2"],
      })
    );
  });

  it("keeps Save disabled when no selection has changed", async () => {
    renderPlaylistContent();

    await screen.findByText("Movies to watch");
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();
    fireEvent.click(saveButton);

    expect(PlaylistClient.addMediaToMultiplePlaylists).not.toHaveBeenCalled();
  });

  it("opens the new playlist modal from + New playlist", async () => {
    const onClose = vi.fn();
    const handleNewPlaylistModalOpen = vi.fn();
    renderPlaylistContent({ onClose, handleNewPlaylistModalOpen });

    await screen.findByText("Movies to watch");
    fireEvent.click(screen.getByRole("button", { name: /new playlist/i }));

    expect(onClose).toHaveBeenCalled();
    expect(handleNewPlaylistModalOpen).toHaveBeenCalled();
  });
});
