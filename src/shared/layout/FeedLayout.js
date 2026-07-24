import { Box } from "@mui/material";
import { tokens } from "../../styles/tokens";
import RightRail from "./RightRail";

const FeedLayout = ({ children, showRail = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: showRail ? "space-between" : "center",
        alignItems: "flex-start",
        width: "100%",
        gap: { md: 4, lg: 5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: tokens.layout.feedMaxWidth,
          flex: "1 1 auto",
          minWidth: 0,
        }}
      >
        {children}
      </Box>
      {showRail ? <RightRail /> : null}
    </Box>
  );
};

export default FeedLayout;
