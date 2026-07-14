import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import AddPlaylistModal from "./AddPlaylistModal";
import PlaylistClient from "../../client/PlaylistClient";

jest.mock("../../client/PlaylistClient");

describe("AddPlaylistModal", () => {
  it("disables Submit until a name is entered", () => {
    renderWithProviders(
      <AddPlaylistModal open onClose={jest.fn()} profileUserName="shree" />,
      { userContextValue: { currentUser: { userName: "shree" } } }
    );

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Weekend watch" },
    });

    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
  });

  it("creates the playlist and closes the modal on success", async () => {
    const onClose = jest.fn();
    PlaylistClient.createPlaylist.mockResolvedValue({});

    renderWithProviders(
      <AddPlaylistModal open onClose={onClose} profileUserName="shree" />,
      { userContextValue: { currentUser: { userName: "shree" } } }
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Weekend watch" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(PlaylistClient.createPlaylist).toHaveBeenCalledWith({
        playlistName: "Weekend watch",
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
