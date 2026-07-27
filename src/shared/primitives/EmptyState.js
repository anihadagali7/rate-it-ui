import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const EmptyState = ({ title, description, action }) => {
  return (
    <Box
      sx={{
        textAlign: "left",
        py: 4,
        px: 0,
        borderTop: `1px solid ${tokens.colors.border}`,
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}
    >
      <Typography
        sx={{
          fontFamily: tokens.fonts.display,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: tokens.colors.textPrimary,
          mb: 0.75,
        }}
      >
        {title}
      </Typography>
      {description ? (
        <Typography
          sx={{
            fontSize: 15,
            lineHeight: 1.6,
            color: tokens.colors.textSecondary,
            maxWidth: 420,
          }}
        >
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={{ mt: 2.5 }}>{action}</Box> : null}
    </Box>
  );
};

export default EmptyState;
