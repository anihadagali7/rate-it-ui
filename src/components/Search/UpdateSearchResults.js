import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";

const UpdatedSearchResults = ({ searchResults, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const scrollCarousel = (categoryId, direction) => {
    const carousel = document.getElementById(categoryId);
    const scrollAmount =
      direction === "left"
        ? -carousel.offsetWidth * 0.8
        : carousel.offsetWidth * 0.8;
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const categories = [
    {
      id: "movies",
      title: "Movies",
      data: searchResults?.movie,
    },
    {
      id: "tvShows",
      title: "TV Shows",
      data: searchResults?.tv,
    },
    { id: "books", title: "Books", data: searchResults?.book },
    {
      id: "music",
      title: "Music",
      data: searchResults?.music,
    },
  ];

  const categoriesWithResults = categories.filter(
    (category) => category?.data?.length > 0
  );

  return (
    <Container maxWidth="xl" className="py-4 min-h-screen">
      <Box sx={{ marginBottom: "10px" }}>
        <Typography variant="body2" color="textSecondary">
          Found {categories.reduce((acc, cat) => acc + cat.data.length, 0)}{" "}
          items across {categoriesWithResults.length} categories
        </Typography>
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {categoriesWithResults.map((category) => (
            <Box key={category.id} className="mb-8">
              <Box className="flex justify-between items-center mb-2">
                <Box className="flex items-center">
                  <Typography variant="h6" className=" font-medium">
                    {category.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="ml-2"
                  >
                    ({category.data.length})
                  </Typography>
                </Box>

                {!isMobile && category.data.length > (isTablet ? 3 : 4) && (
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => scrollCarousel(category.id, "left")}
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => scrollCarousel(category.id, "right")}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Box>
                )}

                <Typography>View All</Typography>
              </Box>

              <Box
                id={category.id}
                className="flex overflow-x-auto pb-4 gap-3 pl-2"
                sx={{
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollSnapType: "x mandatory",
                }}
              >
                {category.data.map((item) => (
                  <Box
                    key={item.id}
                    elevation={1}
                    sx={{
                      minWidth: isMobile ? 140 : 170,
                      maxWidth: isMobile ? 140 : 170,
                      scrollSnapAlign: "start",
                    }}
                  >
                    <div class="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
                      <div
                        class="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
                        style={{
                          backgroundImage: `url(${
                            item.poster ? item.poster : NotFoundImage
                          })`,
                        }}
                      ></div>

                      <div class="w-56 max-w-full -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800 h-16 flex items-center justify-center px-2">
                        <h3 class="text-sm font-bold text-center text-gray-800 uppercase dark:text-white line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </Box>
                ))}
              </Box>

              <Divider className="mt-2" />
            </Box>
          ))}
        </Box>
      )}

      {!loading && categoriesWithResults.length === 0 && (
        <Box className="flex flex-col items-center justify-center py-12">
          <Typography variant="h6">No results found</Typography>
          <Typography variant="body2" color="textSecondary" className="mt-1">
            Try different keywords or browse categories
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UpdatedSearchResults;
