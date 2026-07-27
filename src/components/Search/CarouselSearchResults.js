import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import MediaCard from "../../shared/media/MediaCard";
import SectionHeader from "../../shared/layout/SectionHeader";
import SurfaceCard from "../../shared/primitives/SurfaceCard";
import { tokens } from "../../styles/tokens";

const MEDIA_CATEGORIES = [
  { id: "movie", title: "Movies" },
  { id: "tv", title: "TV Shows" },
  { id: "music", title: "Music" },
  { id: "book", title: "Books" },
];

const CarouselSearchResults = ({
  searchResults,
  setViewAllMedia,
  setViewAllType,
}) => {
  const scrollCarousel = (categoryId, direction) => {
    const carousel = document.getElementById(`carousel-${categoryId}`);
    if (!carousel) return;

    const scrollAmount =
      direction === "left"
        ? -carousel.offsetWidth * 0.8
        : carousel.offsetWidth * 0.8;
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const categoriesWithResults = MEDIA_CATEGORIES.filter(
    (category) => searchResults?.[category.id]?.length > 0
  );

  if (categoriesWithResults.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {categoriesWithResults.map((category) => (
        <SurfaceCard key={category.id} padding={2}>
          <SectionHeader
            title={category.title}
            actionLabel="See all"
            onAction={() => {
              setViewAllType({ type: category.id, title: category.title });
              setViewAllMedia(true);
            }}
          />

          <Box
            id={`carousel-${category.id}`}
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              scrollSnapType: "x mandatory",
            }}
          >
            {searchResults[category.id].map((item) => (
              <Box key={item.mediaId} sx={{ scrollSnapAlign: "start" }}>
                <MediaCard item={item} mediaType={category.id} />
              </Box>
            ))}
          </Box>

          {searchResults[category.id].length > 3 ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <IconButton
                size="small"
                onClick={() => scrollCarousel(category.id, "left")}
                sx={{ color: tokens.colors.textSecondary }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => scrollCarousel(category.id, "right")}
                sx={{ color: tokens.colors.textSecondary }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          ) : null}
        </SurfaceCard>
      ))}
    </Box>
  );
};

export default CarouselSearchResults;
