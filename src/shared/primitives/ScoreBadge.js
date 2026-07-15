import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { tokens } from "../../styles/tokens";

const ScoreBadge = ({ score, maxScore = 10, size = "md" }) => {
  const isSmall = size === "sm";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        backgroundColor: "#FFFBEB",
        border: `1px solid ${tokens.colors.ratingGold}`,
        borderRadius: `${tokens.radius.button}px`,
        px: isSmall ? 1 : 1.25,
        py: isSmall ? 0.25 : 0.5,
      }}
    >
      <StarIcon
        sx={{
          fontSize: isSmall ? 14 : 16,
          color: tokens.colors.ratingGold,
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: isSmall ? 12 : 14,
          fontWeight: 700,
          color: tokens.colors.textPrimary,
          lineHeight: 1,
        }}
      >
        {score}/{maxScore}
      </Typography>
    </Box>
  );
};

export default ScoreBadge;
