import { Box } from "@mui/material";
import { tokens } from "../../styles/tokens";
import RightRail from "./RightRail";

const FeedLayout = ({ children, showRail = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: tokens.layout.feedMaxWidth,
          flexShrink: 0,
          px: { xs: 0, sm: 1 },
        }}
      >
        {children}
      </Box>
      {showRail ? <RightRail /> : null}
    </Box>
  );
};

export default FeedLayout;
