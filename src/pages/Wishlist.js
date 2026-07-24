import { Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DisplayWishlistByUser from "../components/wishlist/DisplayWishlistByUser";
import FeedLayout from "../shared/layout/FeedLayout";
import Toast from "../shared/feedback/Toast";
import { tokens } from "../styles/tokens";

const Wishlist = () => {
  const { userName } = useParams();
  const [toast, setToast] = useState({ open: false, message: "" });

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
        Wishlist
      </Typography>
      <DisplayWishlistByUser
        userName={userName}
        onRemoved={() =>
          setToast({
            open: true,
            message: "Removed from your wishlist",
          })
        }
      />
      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: "" })}
      />
    </FeedLayout>
  );
};

export default Wishlist;
