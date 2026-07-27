import { Box, Skeleton, Stack } from "@mui/material";
import SurfaceCard from "../primitives/SurfaceCard";

const MediaInfoLoading = () => {
  return (
    <SurfaceCard padding={2.5}>
      <Skeleton variant="text" width={80} height={28} sx={{ mb: 2 }} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
        <Skeleton
          variant="rounded"
          width={160}
          height={240}
          sx={{ mx: { xs: "auto", sm: 0 } }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={36} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="rounded" width={90} height={32} sx={{ mt: 2 }} />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Skeleton variant="rounded" width={100} height={36} />
            <Skeleton variant="rounded" width={130} height={36} />
            <Skeleton variant="rounded" width={140} height={36} />
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="92%" />
        <Skeleton variant="text" width="80%" />
      </Box>
    </SurfaceCard>
  );
};

export default MediaInfoLoading;
