import { Box } from "@mui/material";
import { tokens } from "../../styles/tokens";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: tokens.layout.authMaxWidth }}>
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
