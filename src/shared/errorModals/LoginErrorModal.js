import React from "react";
import { Box, Container, Dialog, DialogTitle, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";


const LoginErrorModal = ({ open, onClose }) => {
  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{
                      "& .MuiDialog-paper": {
                        width: "100%",
                        maxHeight: 325,
                        maxWidth: 400,
                        overflowY: "hidden"
                      }
                    }}>
              <DialogTitle
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "0px",
                  textAlign: "center"
                }}>Error</DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Container
                  maxWidth={"sm"}
                  sx={{ marginTop: "20px", marginBottom: "25px" }}
                >
                  <Stack direction="column" spacing={2}>
                    <Typography sx={{ fontSize: "13px", marginLeft: 'auto', marginRight: 'auto' }}>Please login to get the full experience!</Typography>
                    <Button component={Link} to="/login" variant="outlined" sx={{  }}>
                      <Typography sx={{ fontSize: "13px", textDecoration: 'none', color: '#00a8ff' }} component={Link} to="/login">
                        Login
                      </Typography>
                    </Button>
                  </Stack>
                </Container>
              </Box>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default LoginErrorModal;