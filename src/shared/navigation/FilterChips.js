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
              border: `1px solid ${
                isActive ? tokens.colors.accent : tokens.colors.borderStrong
              }`,
              backgroundColor: isActive
                ? tokens.colors.accentSubtle
                : tokens.colors.surface,
              color: isActive ? tokens.colors.accent : tokens.colors.textSecondary,
              borderRadius: `${tokens.radius.pill}px`,
              px: 2,
              py: 0.75,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: tokens.colors.accent,
                backgroundColor: isActive
                  ? tokens.colors.accentSubtle
                  : tokens.colors.surfaceHover,
              },
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>
              {option.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default FilterChips;
