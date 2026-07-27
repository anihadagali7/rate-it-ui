import { Box, Skeleton } from "@mui/material";
import { tokens } from "../../styles/tokens";

const ProfileRatingsLoading = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {[...Array(3)].map((_, index) => (
        <Box
          key={index}
          sx={{
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: tokens.colors.surface,
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" height={18} />
              <Skeleton variant="text" width="25%" height={14} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width="90%" height={14} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="70%" height={14} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ProfileRatingsLoading;
