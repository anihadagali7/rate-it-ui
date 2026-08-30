import { Box, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const TabBar = ({ tabs, activeTab, onChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2.5, mb: 2.5 }}>
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
            {/* A single bar per tab that changes color, rather than a
                separate always-on baseline plus a scaling highlight — two
                independently-positioned elements could drift apart by a
                pixel or two depending on the native <button> box model. */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 2,
                borderRadius: 2,
                backgroundColor: isActive
                  ? tokens.colors.signal
                  : tokens.colors.border,
                transition: `background-color ${tokens.motion.calm}`,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default TabBar;
