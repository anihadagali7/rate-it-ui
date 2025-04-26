import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Container, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchClient from "../../client/SearchClient";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import IndividualSearchResultsLoading from "../../shared/loading/IndividualSearchResultsLoading";

const IndividualSearchResults = ({
  searchKeyword,
  viewAllType,
  setViewAllMedia,
}) => {
  const loadMoreRef = useRef(null);

  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSuccess,
  } = useInfiniteQuery(
    ["searchMedia", viewAllType.type, searchKeyword],
    async ({ pageParam = 1 }) => {
      const response = await SearchClient.searchMedia(
        viewAllType.type,
        searchKeyword,
        pageParam
      );
      console.log("response ", response);
      return {
        data: response.data.data.mediaList,
        currentPage: pageParam,
        totalPages: response.data.data.totalPages,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      staleTime: 60000,
      enabled: !!searchKeyword,
    }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "500px",
        threshold: 0,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage]);

  const allItems = searchResults?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Container>
      <PrimaryButton
        variant="text"
        leftIcon={<KeyboardBackspaceIcon style={{ color: "#000" }} />}
        onClick={() => setViewAllMedia(false)}
      >
        Return
      </PrimaryButton>
      <Typography variant="h5" className="font-medium">
        Results for "{searchKeyword}"
      </Typography>
      <Typography variant="h6" className=" font-medium">
        {viewAllType.title}
      </Typography>
      <List>
        {console.log("allItems in return  ", allItems)}
        {isSuccess &&
          allItems &&
          allItems.length > 0 &&
          allItems.map((row, index) => {
            return (
              <ListItem
                component={Link}
                to={`/${viewAllType}/${row.mediaId}`}
                key={index}
              >
                <div class="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                  <div
                    class="w-full h-96 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
                    style={{
                      backgroundImage: `url(${
                        row.poster ? row.poster : NotFoundImage
                      })`,
                    }}
                  ></div>

                  <div class="w-full max-w-full -mt-10 overflow-hidden rounded-lg shadow-lg md:w-64 bg-gray-800 h-12 flex items-center justify-center px-2">
                    <h3 class="text-sm font-bold text-center uppercase text-white line-clamp-2 leading-tight">
                      {row.name}
                    </h3>
                  </div>
                </div>
              </ListItem>
            );
          })}
        {isLoading && <IndividualSearchResultsLoading />}
      </List>
      <div ref={loadMoreRef} className="h-10" />

      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </Container>
  );
};

export default IndividualSearchResults;
