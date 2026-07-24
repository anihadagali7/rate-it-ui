import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Snackbar, Typography } from "@mui/material";
import { tokens } from "../../styles/tokens";

const Toast = ({ open, message, onClose, autoHideDuration = 3500 }) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        bottom: { xs: 88, md: 28 },
      }}
    >
      <Box
        role="status"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          minWidth: 280,
          maxWidth: 420,
          px: 2,
          py: 1.5,
          backgroundColor: tokens.colors.textPrimary,
          color: tokens.colors.surface,
          borderRadius: `${tokens.radius.card}px`,
          boxShadow: tokens.shadows.lift,
          border: `1px solid ${tokens.colors.accent}`,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ color: tokens.colors.success, fontSize: 22, flexShrink: 0 }}
        />
        <Typography
          sx={{
            flex: 1,
            fontFamily: tokens.fonts.body,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.4,
            color: "#FBFCFB",
          }}
        >
          {message}
        </Typography>
        <IconButton
          aria-label="Dismiss"
          size="small"
          onClick={onClose}
          sx={{
            color: tokens.colors.surface,
            opacity: 0.75,
            "&:hover": { opacity: 1, backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default Toast;
