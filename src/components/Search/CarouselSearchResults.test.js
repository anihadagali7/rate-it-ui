import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import CarouselSearchResults from "./CarouselSearchResults";

beforeEach(() => {
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

const movie = { id: "m1", mediaId: "11324", name: "Shutter Island", poster: "poster.jpg" };
const song = { id: "s1", mediaId: "6EGh05sts1Y48cG6RhLdWm", name: "Let's Live For Today" };

describe("CarouselSearchResults", () => {
  it("renders only the categories that have results", () => {
    renderWithProviders(
      <CarouselSearchResults
        searchResults={{ movie: [movie], tv: [], music: [song] }}
        setViewAllMedia={jest.fn()}
        setViewAllType={jest.fn()}
      />
    );

    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Shutter Island")).toBeInTheDocument();
    expect(screen.getByText("Let's Live For Today")).toBeInTheDocument();
    expect(screen.queryByText("TV Shows")).not.toBeInTheDocument();
    expect(screen.queryByText("Books")).not.toBeInTheDocument();
  });

  it("links each result to its media details page", () => {
    renderWithProviders(
      <CarouselSearchResults
        searchResults={{ movie: [movie] }}
        setViewAllMedia={jest.fn()}
        setViewAllType={jest.fn()}
      />
    );

    expect(screen.getByText("Shutter Island").closest("a")).toHaveAttribute(
      "href",
      "/movie/11324"
    );
  });

  it("returns null when every category is empty", () => {
    const { container } = renderWithProviders(
      <CarouselSearchResults
        searchResults={{ movie: [], tv: [], book: [], music: [] }}
        setViewAllMedia={jest.fn()}
        setViewAllType={jest.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("switches to the full results view for a category when See all is clicked", () => {
    const setViewAllMedia = jest.fn();
    const setViewAllType = jest.fn();

    renderWithProviders(
      <CarouselSearchResults
        searchResults={{ movie: [movie] }}
        setViewAllMedia={setViewAllMedia}
        setViewAllType={setViewAllType}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /see all/i }));

    expect(setViewAllType).toHaveBeenCalledWith({ type: "movie", title: "Movies" });
    expect(setViewAllMedia).toHaveBeenCalledWith(true);
  });
});
