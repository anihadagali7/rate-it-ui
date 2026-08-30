import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../testUtils/renderWithProviders";
import IndividualSearchResults from "./IndividualSearchResults";
import SearchClient from "../../client/SearchClient";

jest.mock("../../client/SearchClient");

describe("IndividualSearchResults - people tab", () => {
  const viewAllType = { type: "user", title: "People" };

  it("prompts an anonymous visitor to sign in, without a stuck loading skeleton", async () => {
    const { container } = renderWithProviders(
      <IndividualSearchResults
        searchKeyword="jane"
        viewAllType={viewAllType}
        setViewAllMedia={() => {}}
      />
    );

    expect(
      await screen.findByText("Sign in to search for people.")
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(0);
    expect(SearchClient.searchMedia).not.toHaveBeenCalled();
  });

  it("shows people results when signed in", async () => {
    SearchClient.searchMedia.mockResolvedValue({
      data: {
        data: {
          mediaList: [
            { userName: "janedoe", firstName: "Jane", lastName: "Doe", followers: [] },
          ],
        },
      },
    });

    renderWithProviders(
      <IndividualSearchResults
        searchKeyword="jane"
        viewAllType={viewAllType}
        setViewAllMedia={() => {}}
      />,
      { userContextValue: { currentUser: { userName: "viewer" } } }
    );

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(SearchClient.searchMedia).toHaveBeenCalledWith("user", "jane", 1);
  });
});
