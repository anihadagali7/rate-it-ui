import { useQuery } from "@tanstack/react-query";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import AddPlaylistModal from "./AddPlaylistModal";
import PlaylistClient from "../../client/PlaylistClient";

vi.mock("../../client/PlaylistClient");

const userContextValue = { currentUser: { userName: "shree" } };

// Stands in for the playlist lists on the profile and media pages, which are
// keyed ["getAllPlaylistForUser", userName].
const PlaylistListProbe = ({ fetchPlaylists }) => {
  useQuery({
    queryKey: ["getAllPlaylistForUser", "shree"],
    queryFn: fetchPlaylists,
  });
  return null;
};

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const renderModal = ({ onClose = vi.fn(), fetchPlaylists } = {}) => {
  renderWithProviders(
    <>
      {fetchPlaylists && <PlaylistListProbe fetchPlaylists={fetchPlaylists} />}
      <AddPlaylistModal open onClose={onClose} />
    </>,
    { userContextValue }
  );
  return { onClose };
};

const typeName = (value) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value } });

const submitButton = () =>
  screen.getByRole("button", { name: /submit|creating/i });

describe("AddPlaylistModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables Submit until a non-blank name is entered", () => {
    renderModal();

    expect(submitButton()).toBeDisabled();

    typeName("   ");
    expect(submitButton()).toBeDisabled();

    typeName("Weekend watch");
    expect(submitButton()).not.toBeDisabled();
  });

  it("creates the playlist, refreshes the user's playlist list, and closes", async () => {
    PlaylistClient.createPlaylist.mockResolvedValue({ status: 201 });
    const fetchPlaylists = vi.fn().mockResolvedValue({ data: { data: {} } });
    const { onClose } = renderModal({ fetchPlaylists });
    await waitFor(() => expect(fetchPlaylists).toHaveBeenCalledTimes(1));

    typeName("  Weekend watch ");
    fireEvent.click(submitButton());

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(PlaylistClient.createPlaylist).toHaveBeenCalledWith({
      playlistName: "Weekend watch",
    });
    // The list was refetched, so the new playlist shows without a refresh.
    await waitFor(() => expect(fetchPlaylists).toHaveBeenCalledTimes(2));
  });

  it("waits for the request before closing, and can't double-submit", async () => {
    const request = deferred();
    PlaylistClient.createPlaylist.mockReturnValue(request.promise);
    const { onClose } = renderModal();

    typeName("Weekend watch");
    fireEvent.click(submitButton());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled()
    );
    fireEvent.click(submitButton());
    expect(PlaylistClient.createPlaylist).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    request.resolve({ status: 201 });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("shows the API's error, stays open, and lets the user retry", async () => {
    PlaylistClient.createPlaylist.mockRejectedValueOnce({
      response: { status: 404, data: { errors: { msg: "User not found" } } },
    });
    const { onClose } = renderModal();

    typeName("Weekend watch");
    fireEvent.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "User not found"
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();

    PlaylistClient.createPlaylist.mockResolvedValueOnce({ status: 201 });
    fireEvent.click(submitButton());
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("shows a generic message when the request fails without an API error", async () => {
    PlaylistClient.createPlaylist.mockRejectedValueOnce(
      new Error("Network Error")
    );
    renderModal();

    typeName("Weekend watch");
    fireEvent.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't create the playlist. Please try again."
    );
  });

  it("clears the error once the user edits the name", async () => {
    PlaylistClient.createPlaylist.mockRejectedValueOnce({
      response: { data: { errors: { msg: "User not found" } } },
    });
    renderModal();

    typeName("Weekend watch");
    fireEvent.click(submitButton());
    await screen.findByRole("alert");

    typeName("Weekend watch 2");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
