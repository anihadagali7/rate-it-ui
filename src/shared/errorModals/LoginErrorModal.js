import React from "react";
import { Box, Container, Dialog, DialogTitle, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import PrimaryButton from "../buttons/PrimaryButton";

const LoginErrorModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxHeight: 325,
          maxWidth: 400,
          overflowY: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "13px",
          fontWeight: "bold",
          height: "0px",
          textAlign: "center",
        }}
      >
        Error
      </DialogTitle>
      <Box>
        <Container sx={{ marginTop: "20px", marginBottom: "25px" }}>
          <Stack direction="column" spacing={2}>
            <Typography
              sx={{
                fontSize: "13px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Please login to get the full experience!
            </Typography>
            <PrimaryButton
              testId="loginErrorModal"
              buttonElement={Link}
              variant="contained"
              link="/login"
            >
              Login
            </PrimaryButton>
          </Stack>
        </Container>
      </Box>
    </Dialog>
  );
};

export default LoginErrorModal;
