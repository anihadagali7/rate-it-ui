import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const TabBar = ({ tabs, activeTab, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2.5,
        mb: 2.5,
        borderBottom: `1px solid ${tokens.colors.border}`,
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
              position: "relative",
              border: "none",
              background: "none",
              cursor: "pointer",
              px: 0.25,
              py: 1.25,
            }}
          >
            <Typography
              sx={{
                fontFamily: tokens.fonts.display,
                fontSize: 15,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "-0.01em",
                color: isActive
                  ? tokens.colors.textPrimary
                  : tokens.colors.textSecondary,
              }}
            >
              {tab.label}
            </Typography>
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                borderRadius: 2,
                backgroundColor: tokens.colors.signal,
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transition: `transform ${tokens.motion.calm}`,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default TabBar;
