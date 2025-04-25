import {
    ArrowBack,
    ArrowForward,
    Book,
    Movie,
    MusicNote,
    Tv
} from "@mui/icons-material";
import {
    Box,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Typography,
    useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import NotFoundImage from "../../imgs/Image-Not-Available.jpeg";

const sampleResults = {
  movies: [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      rating: 4.5,
      image: "/api/placeholder/150/225",
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      year: 1994,
      rating: 4.8,
      image: "/api/placeholder/150/225",
    },
    {
      id: 3,
      title: "The Dark Knight",
      year: 2008,
      rating: 4.7,
      image: "/api/placeholder/150/225",
    },
    {
      id: 4,
      title: "Pulp Fiction",
      year: 1994,
      rating: 4.6,
      image: "/api/placeholder/150/225",
    },
    {
      id: 5,
      title: "Fight Club",
      year: 1999,
      rating: 4.4,
      image: "/api/placeholder/150/225",
    },
  ],
  tvShows: [
    {
      id: 1,
      title: "Breaking Bad",
      year: "2008-2013",
      rating: 4.9,
      image: "/api/placeholder/150/225",
    },
    {
      id: 2,
      title: "Game of Thrones",
      year: "2011-2019",
      rating: 4.7,
      image: "/api/placeholder/150/225",
    },
    {
      id: 3,
      title: "The Wire",
      year: "2002-2008",
      rating: 4.8,
      image: "/api/placeholder/150/225",
    },
    {
      id: 4,
      title: "Stranger Things",
      year: "2016-Present",
      rating: 4.5,
      image: "/api/placeholder/150/225",
    },
    {
      id: 5,
      title: "The Office",
      year: "2005-2013",
      rating: 4.6,
      image: "/api/placeholder/150/225",
    },
  ],
  books: [
    {
      id: 1,
      title: "1984",
      author: "George Orwell",
      rating: 4.6,
      image: "/api/placeholder/150/225",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      rating: 4.8,
      image: "/api/placeholder/150/225",
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      rating: 4.3,
      image: "/api/placeholder/150/225",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      rating: 4.5,
      image: "/api/placeholder/150/225",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      rating: 4.1,
      image: "/api/placeholder/150/225",
    },
  ],
  music: [
    {
      id: 1,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      rating: 4.9,
      image: "/api/placeholder/150/150",
    },
    {
      id: 2,
      title: "Thriller",
      artist: "Michael Jackson",
      rating: 4.8,
      image: "/api/placeholder/150/150",
    },
    {
      id: 3,
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      rating: 4.7,
      image: "/api/placeholder/150/150",
    },
    {
      id: 4,
      title: "Imagine",
      artist: "John Lennon",
      rating: 4.6,
      image: "/api/placeholder/150/150",
    },
    {
      id: 5,
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      rating: 4.5,
      image: "/api/placeholder/150/150",
    },
  ],
};

const UpdatedSearchResults = ({ searchResults, loading, searchQuery }) => {
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
      icon: <Movie />,
      data: searchResults?.movie,
    },
    {
      id: "tvShows",
      title: "TV Shows",
      icon: <Tv />,
      data: searchResults?.tv,
    },
    { id: "books", title: "Books", icon: <Book />, data: searchResults?.book },
    {
      id: "music",
      title: "Music",
      icon: <MusicNote />,
      data: searchResults?.music,
    },
  ];

  const categoriesWithResults = categories.filter(
    (category) => category?.data?.length > 0
  );

  return (
    <Container maxWidth="xl" className="py-4 min-h-screen">
      <Box>
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
              <Box className="flex justify-between items-center mb-2 px-2">
                <Box className="flex items-center">
                  {category.icon}
                  <Typography variant="h6" className="ml-2 font-medium">
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
