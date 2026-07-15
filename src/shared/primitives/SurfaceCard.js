import { Box } from "@mui/material";
import { tokens } from "../../styles/tokens";

const SurfaceCard = ({
  children,
  onClick,
  padding = 2.5,
  sx = {},
  ...props
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: `${tokens.radius.card}px`,
        padding,
        transition: "border-color 0.15s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? { borderColor: tokens.colors.borderStrong }
          : undefined,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default SurfaceCard;
