import React, { useEffect } from "react";
import { Box, Dialog, DialogTitle, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../../Theme/Theme";
import { Provider } from "jotai";


const AddRatingModal = ({ open, onClose, mediaId, mediaType, mediaDetails }) => {

  useEffect(() => {
  }, []);

  return (
    <>
      {console.log("media ", mediaDetails)}
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose}
                    sx={{ "& .MuiDialog-paper": { width: "100%", height: 300, maxWidth: 500, overflowY: "hidden" } }}>
              <DialogTitle
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  height: "0px",
                  textAlign: "center"
                }}>{mediaDetails.name}</DialogTitle>
              <Box sx={{ width: "100%" }}>

              </Box>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default AddRatingModal;