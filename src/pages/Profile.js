import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  StyledEngineProvider,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams } from "react-router-dom";
import UserClient from "../client/UserClient";
import FriendsModal from "../components/FriendsModal";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
};

const Profile = () => {
  const { userName } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [currentProfile, setCurrentProfile] = useState({});
  const [openFriendsModal, setOpenFriendsModal] = useState(false);
  const [friendsTab, setFriendsTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getProfileDetails = async () => {
    const result = await UserClient.getUserInfo(userName);
    setCurrentProfile(result.data.user)
  };

  useEffect(async () => {
    getProfileDetails();
  }, [userName])

  const handleFriendsModalClose = () => {
    setOpenFriendsModal(false);
  };

  const handleFriendsModalOpen = (initialTab) => {
    setFriendsTab(initialTab);
    setOpenFriendsModal(true);
  };

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
                      <Typography component="div"
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
                      {currentProfile.firstName}
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
                      @{currentProfile.userName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <span
                      style={{
                        marginLeft: "22px",
                        marginTop: "0px",
                        fontSize: "13px",
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleFriendsModalOpen(0)}
                    >
                      {currentProfile && currentProfile.following && currentProfile.following.length}
                      <span style={{fontWeight: 'normal'}}> following</span>
                    </span>
                    <span
                      style={{
                        marginLeft: "22px",
                        marginTop: "0px",
                        fontSize: "13px",
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleFriendsModalOpen(1)}
                    >
                      {currentProfile && currentProfile.followers && currentProfile.followers.length}
                      <span style={{fontWeight: 'normal'}}> followers</span>
                    </span>
                  </Grid>
                </Grid>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      sx={{ color: "#00a8ff" }}
                      TabIndicatorProps={{ style: { background: "#00a8ff" } }}
                    >
                      <Tab
                        sx={{
                          fontSize: "13px",
                          "&.Mui-selected": {
                            color: "#40a9ff",
                            fontSize: "13px",
                          },
                          "&.Mui-focusVisible": {
                            backgroundColor: "#40a9ff",
                          },
                        }}
                        label="Ratings"
                      />
                      <Tab
                        sx={{
                          fontSize: "13px",
                          "&.Mui-selected": {
                            color: "#40a9ff",
                            fontSize: "13px",
                          },
                          "&.Mui-focusVisible": {
                            backgroundColor: "#40a9ff",
                          },
                        }}
                        label="Likes"
                      />
                      <Tab
                        sx={{
                          fontSize: "13px",
                          "&.Mui-selected": {
                            color: "#40a9ff",
                            fontSize: "13px",
                          },
                          "&.Mui-focusVisible": {
                            backgroundColor: "#40a9ff",
                          },
                        }}
                        label="Comments"
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0}>
                    Ratings
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    Likes
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    Comments
                  </TabPanel>
                </Box>
              </Paper>
            </Box>
          </Container>
          {openFriendsModal && (
            <FriendsModal open={openFriendsModal} onClose={handleFriendsModalClose} userName={currentProfile.userName}
            openingTab={friendsTab} followingList={currentProfile.following} followersList={currentProfile.followers}/>
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default Profile;
