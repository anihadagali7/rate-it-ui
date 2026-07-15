import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const TabBar = ({ tabs, activeTab, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        borderBottom: `1px solid ${tokens.colors.border}`,
        mb: 2,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Box
            key={tab.id}
            component="button"
            type="button"
            onClick={() => onChange(tab.id)}
            sx={{
              flex: 1,
              border: "none",
              background: "none",
              cursor: "pointer",
              py: 1.25,
              px: 2,
              borderRadius: `${tokens.radius.button}px ${tokens.radius.button}px 0 0`,
              backgroundColor: isActive
                ? tokens.colors.accentSubtle
                : "transparent",
              borderBottom: isActive
                ? `2px solid ${tokens.colors.accent}`
                : "2px solid transparent",
              mb: "-1px",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? tokens.colors.accent
                  : tokens.colors.textSecondary,
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default TabBar;
