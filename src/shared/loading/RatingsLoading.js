import { Box, Skeleton, Stack } from "@mui/material";
import FeedLayout from "../layout/FeedLayout";
import SurfaceCard from "../primitives/SurfaceCard";

const RatingsLoading = () => {
  return (
    <FeedLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[...Array(4)].map((_, index) => (
          <SurfaceCard key={index} padding={2.5}>
            <Stack direction="row" spacing={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="25%" height={16} sx={{ mt: 0.5 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1.5 }} />
                <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="80%" height={16} />
              </Box>
              <Skeleton
                variant="rounded"
                width={80}
                height={120}
                sx={{ display: { xs: "none", sm: "block" } }}
              />
            </Stack>
          </SurfaceCard>
        ))}
      </Box>
    </FeedLayout>
  );
};

export default RatingsLoading;
