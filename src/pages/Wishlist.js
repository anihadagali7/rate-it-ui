import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import DisplayWishlistByUser from "../components/wishlist/DisplayWishlistByUser";
import FeedLayout from "../shared/layout/FeedLayout";
import { tokens } from "../styles/tokens";

const Wishlist = () => {
  const { userName } = useParams();

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
      <DisplayWishlistByUser userName={userName} />
    </FeedLayout>
  );
};

export default Wishlist;
