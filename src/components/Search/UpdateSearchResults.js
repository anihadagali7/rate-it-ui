import {
  ArrowBack,
  ArrowForward,
  Book,
  History,
  Movie,
  MusicNote,
  TrendingUp,
  Tv,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Rating,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

// Sample search results for demonstration
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

const UpdatedSearchResults = ({
  searchResults,
  loading,
  searchQuery,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Carousel scrolling logic
  const scrollCarousel = (categoryId, direction) => {
    const carousel = document.getElementById(categoryId);
    const scrollAmount =
      direction === "left"
        ? -carousel.offsetWidth * 0.8
        : carousel.offsetWidth * 0.8;
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Media category definition with their respective icons
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

  console.log("categories ", categories);

  // Find categories with results
  const categoriesWithResults = categories.filter(
    (category) => category?.data?.length > 0
  );

  return (
    <Container maxWidth="xl" className="bg-gray-50 py-4 min-h-screen">
      {/* Search Header */}
      <Paper elevation={1} className="p-4 mb-4">
        {/* Recent & Trending Chips - Optional */}
        <Box className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <Chip
            icon={<History />}
            label="Recent Searches"
            onClick={() => {}}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<TrendingUp />}
            label="Trending"
            onClick={() => {}}
            variant="outlined"
          />
          <Chip
            icon={<Movie />}
            label="Movies"
            onClick={() => {}}
            variant="outlined"
          />
          <Chip
            icon={<Tv />}
            label="TV Shows"
            onClick={() => {}}
            variant="outlined"
          />
          <Chip
            icon={<Book />}
            label="Books"
            onClick={() => {}}
            variant="outlined"
          />
          <Chip
            icon={<MusicNote />}
            label="Music"
            onClick={() => {}}
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Search Results Count */}
      <Box className="mb-4 px-2">
        <Typography variant="h5" className="font-medium">
          Results for "{searchQuery}"
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Found {categories.reduce((acc, cat) => acc + cat.data.length, 0)}{" "}
          items across {categoriesWithResults.length} categories
        </Typography>
      </Box>

      {/* Results by Category - Carousel Layout */}
      {loading ? (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {categoriesWithResults.map((category) => (
            <Box key={category.id} className="mb-8">
              {/* Category Header */}
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

                {/* Carousel Navigation Buttons - Desktop/Tablet only */}
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

              {/* Carousel */}
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
                  <Card
                    key={item.id}
                    elevation={1}
                    sx={{
                      minWidth: isMobile ? 140 : 170,
                      maxWidth: isMobile ? 140 : 170,
                      scrollSnapAlign: "start",
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.title}
                        height={category.id === "music" ? 150 : 225}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent className="p-3">
                        <Typography
                          variant="subtitle2"
                          noWrap
                          className="font-medium"
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          display="block"
                          noWrap
                        >
                          {item.artist || item.author || item.year}
                        </Typography>
                        <Box className="flex items-center mt-1">
                          <Rating
                            value={(item.rating / 5) * 5}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                          <Typography variant="caption" className="ml-1">
                            {item.rating}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>

              <Divider className="mt-2" />
            </Box>
          ))}
        </Box>
      )}

      {/* No Results */}
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
