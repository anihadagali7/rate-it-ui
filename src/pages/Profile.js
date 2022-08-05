import React from "react";
import {
  Container,
  Paper,
  Box,
  ThemeProvider,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { StyledEngineProvider } from "@mui/material";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { currentUser, currentlyLoggedIn } from "../state/user";
import { useAtom } from "jotai";

const Profile = () => {
  const [user, setUser] = useAtom(currentUser);
  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                margin: "auto",
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#FFFFFF",
                  margin: "auto",
                  borderRadius: "17px",
                }}
              >
                <Grid container>
                  <Grid item xs={7} sx={{ marginLeft: "5px" }}>
                    <Avatar
                      src={AccountCircleIcon}
                      sx={{
                        width: 56,
                        height: 56,
                        marginLeft: "13px",
                        marginTop: "10px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "17px",
                        marginTop: "20px",
                        marginRight: "3px",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#00a8ff",
                          fontWeight: "bold",
                        }}
                      >
                        Edit profile
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        marginLeft: "22px",
                        marginTop: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {user.firstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        marginLeft: "22px",
                        marginTop: "0px",
                        fontSize: "13px",
                      }}
                    >
                      @{user.userName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Profile;
