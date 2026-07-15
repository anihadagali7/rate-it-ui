import { Typography } from "@mui/material";
import FeedLayout from "../shared/layout/FeedLayout";
import EmptyState from "../shared/primitives/EmptyState";
import { tokens } from "../styles/tokens";

const Notifications = () => {
  return (
    <FeedLayout>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          color: tokens.colors.textPrimary,
          mb: 2,
        }}
      >
        Notifications
      </Typography>

      <EmptyState
        title="You're all caught up"
        description="Notifications for follows, likes, and comments will appear here."
      />
    </FeedLayout>
  );
};

export default Notifications;
