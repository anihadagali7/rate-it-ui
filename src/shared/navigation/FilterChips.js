import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const FilterChips = ({ options, activeId, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        pb: 0.5,
        mb: 2,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <Box
            key={option.id}
            component="button"
            type="button"
            onClick={() => onChange(option.id)}
            sx={{
              flexShrink: 0,
              border: `1.5px solid ${
                isActive ? tokens.colors.accent : tokens.colors.borderStrong
              }`,
              backgroundColor: isActive
                ? tokens.colors.accent
                : "transparent",
              color: isActive ? "#FBFCFB" : tokens.colors.textSecondary,
              borderRadius: `${tokens.radius.button}px`,
              px: 1.75,
              py: 0.75,
              cursor: "pointer",
              transition: `all ${tokens.motion.quick}`,
              "&:hover": {
                borderColor: tokens.colors.accent,
                color: isActive ? "#FBFCFB" : tokens.colors.accent,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 550,
                fontFamily: tokens.fonts.body,
              }}
            >
              {option.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default FilterChips;
