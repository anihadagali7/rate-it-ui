import { Box, Container, Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import DisplayWishlistByUser from "../components/wishlist/DisplayWishlistByUser";
import UserContext from "../shared/context/userContext";

const Wishlist = () => {
  const { userName } = useParams();
  const { currentUser } = useContext(UserContext);
  const profileUserName = currentUser?.profileUserName;
  const userViewingOwnProfile = userName === profileUserName;

  return (
    <Box>
      <Container
        maxWidth={"sm"}
        sx={{ marginBottom: "25px", marginTop: "25px" }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            minHeight: "300px",
            height: "100%",
            backgroundColor: "#FFFFFF",
            margin: "auto",
            borderRadius: "17px",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              minHeight: "100vh",
              padding: 2,
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "22px",
              }}
            >
              Wishlist
            </Typography>
            <DisplayWishlistByUser profileView={false} userName={userName} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Wishlist;
