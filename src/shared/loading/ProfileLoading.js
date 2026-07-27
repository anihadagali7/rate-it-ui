import { Box, Skeleton } from "@mui/material";
import FeedLayout from "../layout/FeedLayout";
import SurfaceCard from "../primitives/SurfaceCard";

const ProfileLoading = () => {
  return (
    <FeedLayout>
      <SurfaceCard padding={0} sx={{ overflow: "hidden", mb: 2 }}>
        <Skeleton variant="rectangular" height={72} />
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Skeleton
            variant="circular"
            width={56}
            height={56}
            sx={{ mt: -3.5, mb: 2 }}
          />
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="text" width="25%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </SurfaceCard>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} variant="rounded" height={40} sx={{ flex: 1 }} />
        ))}
      </Box>
      <SurfaceCard padding={2.5}>
        <Skeleton variant="rounded" height={160} />
      </SurfaceCard>
    </FeedLayout>
  );
};

export default ProfileLoading;
