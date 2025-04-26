import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Container, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SearchClient from "../../client/SearchClient";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

const IndividualSearchResults = ({
  searchKeyword,
  viewAllType,
  setViewAllMedia,
}) => {
  const {
    isLoading,
    isSuccess,
    mutate: submitSearch,
    data: searchResults,
  } = useMutation({
    mutationFn: async () => {
      const response = await SearchClient.searchMedia(
        viewAllType.type,
        searchKeyword
      );
      return response.data.data.mediaList;
    },
    staleTime: 60000,
  });

  useEffect(() => {
    submitSearch();
  }, [searchKeyword]);

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
        {isSuccess &&
          searchResults &&
          searchResults.length > 0 &&
          searchResults.map((row, index) => {
            return (
              <ListItem
                component={Link}
                to={`/${viewAllType}/${row.mediaId}`}
                key={index}
              >
                <div class="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                  <div
                    class="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
                    style={{
                      backgroundImage: `url(${
                        row.poster ? row.poster : NotFoundImage
                      })`,
                    }}
                  ></div>

                  <div class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
                    <h3 class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">
                      {row.name}
                    </h3>
                  </div>
                </div>
              </ListItem>
            );
          })}
      </List>
    </Container>
  );
};

export default IndividualSearchResults;
