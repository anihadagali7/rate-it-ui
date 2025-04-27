import React from "react";
import { Box, Paper, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

const ProfileWishlistLoading = () => {
  return (
    <Box maxWidth={"sm"} sx={{ marginBottom: "15px" }}>
      {[...Array(6)].map((x, index) => {
        return (
          <Box
            maxWidth={"sm"}
            key={index}
            sx={{
              width: "100%",
              height: "100%",
              margin: "auto",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                margin: "auto",
                borderRadius: "17px",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ margin: "0px 0 10px 15px", paddingTop: "0px" }}
              >
                <>
                  <Skeleton
                    sx={{
                      height: 40,
                      width: 40,
                      marginLeft: "10px",
                      marginTop: "10px",
                    }}
                    animation="wave"
                    variant="circular"
                  />
                  <div>
                    <Stack direction="column">
                      <Skeleton
                        sx={{
                          height: 12,
                          width: 150,
                          marginLeft: "10px",
                          marginTop: "15px",
                        }}
                        animation="wave"
                        variant="rectangular"
                      />
                      <Skeleton
                        sx={{
                          height: 12,
                          width: 50,
                          marginLeft: "10px",
                          marginTop: "5px",
                        }}
                        animation="wave"
                        variant="rectangular"
                      />
                    </Stack>
                  </div>
                </>
              </Stack>
              <Divider
                sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}
              />
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProfileWishlistLoading;
