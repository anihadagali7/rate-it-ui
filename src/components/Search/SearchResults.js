import { Container } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";
import ProfileCard from "../profilecard/ProfileCard";

const SearchResults = ({ results, resultType, handleSearch }) => {
  const listItem = (row, index) => (
    <ListItem component={Link} to={`/${resultType}/${row.mediaId}`} key={index}>
      <div class="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div
          class="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
          style={{
            backgroundImage: `url(${row.poster ? row.poster : NotFoundImage})`,
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

  const listItemUser = (profile) => {
    return <ProfileCard profile={profile} reSearch={() => handleSearch()} />;
  };

  return (
    <Container>
      <List>
        {resultType === "user"
          ? results.map((row, index) => listItemUser(row, index))
          : results.map((row, index) => listItem(row, index))}
      </List>
    </Container>
  );
};

export default SearchResults;
