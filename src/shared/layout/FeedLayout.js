import { Box } from "@mui/material";
import { tokens } from "../../styles/tokens";

const FeedLayout = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: tokens.layout.feedMaxWidth,
        mx: "auto",
        px: { xs: 0, sm: 1 },
      }}
    >
      {children}
    </Box>
  );
};

export default FeedLayout;
