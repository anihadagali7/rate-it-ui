import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/renderWithProviders";
import Search from "./Search";
import SearchClient from "../client/SearchClient";

jest.mock("../client/SearchClient");

let mockKeyword;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ keyword: mockKeyword }),
}));

const mockSearchResponse = (fullSearchList) => ({
  data: { data: { fullSearchList } },
});

beforeEach(() => {
  mockKeyword = undefined;
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query.includes("min-width"),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe("Search", () => {
  it("runs the initial search from the URL keyword and shows results", async () => {
    mockKeyword = "shutter island";
    SearchClient.searchAllMedia.mockResolvedValue(
      mockSearchResponse({
        movie: [
          { id: "m1", mediaId: "11324", name: "Shutter Island", poster: "poster.jpg" },
        ],
      })
    );

    renderWithProviders(<Search />);

    expect(await screen.findByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Shutter Island")).toBeInTheDocument();
    expect(SearchClient.searchAllMedia).toHaveBeenCalledWith("shutter island");
  });

  it("does not run a search on mount when there is no keyword in the URL", () => {
    renderWithProviders(<Search />);

    expect(SearchClient.searchAllMedia).not.toHaveBeenCalled();
    expect(screen.queryByText("Movies")).not.toBeInTheDocument();
  });

  it("runs a search when Enter is pressed after typing a keyword", async () => {
    SearchClient.searchAllMedia.mockResolvedValue(
      mockSearchResponse({
        tv: [{ id: "t1", mediaId: "76331", name: "Succession", poster: "poster.jpg" }],
      })
    );

    renderWithProviders(<Search />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "succession" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(await screen.findByText("Succession")).toBeInTheDocument();
    expect(SearchClient.searchAllMedia).toHaveBeenCalledWith("succession");
  });

  it("does not run a search when Search is used with an empty keyword", () => {
    renderWithProviders(<Search />);

    fireEvent.click(screen.getByText("Search"));

    expect(SearchClient.searchAllMedia).not.toHaveBeenCalled();
  });

  it("shows a loading skeleton while the search request is pending", () => {
    mockKeyword = "succession";
    SearchClient.searchAllMedia.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(<Search />);

    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);
  });

  it("shows a no results message when the search returns nothing", async () => {
    mockKeyword = "asdkjaslkdjasd";
    SearchClient.searchAllMedia.mockResolvedValue(mockSearchResponse({}));

    renderWithProviders(<Search />);

    expect(await screen.findByText("No results found")).toBeInTheDocument();
  });
});
