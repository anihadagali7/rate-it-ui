import { Box, Typography } from "@mui/material";
import PrimaryButton from "../buttons/PrimaryButton";

const QueryErrorState = ({
  message = "Something went wrong while loading this content.",
  onRetry,
}) => {
  return (
    <Box sx={{ py: 4, px: 2, textAlign: "center" }}>
      <Typography color="error" sx={{ mb: onRetry ? 2 : 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <PrimaryButton variant="outlined" onClick={onRetry}>
          Try again
        </PrimaryButton>
      )}
    </Box>
  );
};

export default QueryErrorState;
