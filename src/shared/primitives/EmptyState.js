import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const EmptyState = ({ title, description, action }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 5,
        px: 2,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: `${tokens.radius.card}px`,
        backgroundColor: tokens.colors.surface,
      }}
    >
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 600,
          color: tokens.colors.textPrimary,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      {description ? (
        <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={{ mt: 2 }}>{action}</Box> : null}
    </Box>
  );
};

export default EmptyState;
