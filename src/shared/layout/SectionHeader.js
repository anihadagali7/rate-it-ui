import { Box, Typography } from "@mui/material";
import Button from "../buttons/Button";
import { tokens } from "../../styles/tokens";

const SectionHeader = ({ title, actionLabel, onAction }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          color: tokens.colors.textPrimary,
        }}
      >
        {title}
      </Typography>
      {actionLabel && onAction ? (
        <Button variant="ghost" onClick={onAction} sx={{ py: 0.5, px: 1 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
};

export default SectionHeader;
