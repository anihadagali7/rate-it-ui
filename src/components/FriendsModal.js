import React, { useEffect, useState } from "react";
import {
  Box, Dialog, DialogTitle, StyledEngineProvider,
  ThemeProvider, Typography
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import UserClient from "../client/UserClient";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
};

const FriendsModal = ({ open, onClose, userName, openingTab }) => {
  const [tabValue, setTabValue] = useState(openingTab);
  const [followingList, setFollowingList] = useState({});
  const [followersList, setFollowersList] = useState({});

  const getFollowers = async () => {
    const result = await UserClient.getFollowers(userName);
    setFollowersList(result.data);
  };

  const getFollowing = async () => {
    const result = await UserClient.getFollowing(userName);
    setFollowingList(result.data);
  };

  useEffect(() => {
    getFollowers();
    getFollowing();
  }, [userName]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={onClose} maxWidth="xs"
                    sx={{ "&.MuiPaper-root": { width: "100%", height: 400, maxWidth: 300, overflowY: "hidden" } }}>
              <DialogTitle
                sx={{ fontSize: "13px", fontWeight: "bold", margin: "auto", height: "0px" }}>{userName}</DialogTitle>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    variant="fullWidth"
                    onChange={handleTabChange}
                    sx={{ color: "#00a8ff" }}
                    TabIndicatorProps={{ style: { background: "#00a8ff" } }}
                  >
                    <Tab
                      sx={{
                        fontSize: "13px",
                        "&.Mui-selected": {
                          color: "#40a9ff",
                          fontSize: "13px"
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff"
                        }
                      }}
                      label="Following"
                    />
                    <Tab
                      sx={{
                        fontSize: "13px",
                        "&.Mui-selected": {
                          color: "#40a9ff",
                          fontSize: "13px"
                        },
                        "&.Mui-focusVisible": {
                          backgroundColor: "#40a9ff"
                        }
                      }}
                      label="Followers"
                    />
                  </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                  <List component="nav">
                    {followingList && followingList.length > 0 ? followingList.map((profile) => (
                      <>
                        <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
                          <Typography component="div">
                            {profile.firstName}
                          </Typography>

                        </ListItem>
                        <Divider />
                      </>
                    )) :
                      <div>No following</div>}
                  </List>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <List component="nav">
                    {followersList && followersList.length > 0 ? followersList.map((profile) => (
                      <>
                        <ListItem sx={{ "&.MuiListItem-root": { marginLeft: "-12px" } }}>
                          <Typography component="div">
                            {profile.firstName}
                          </Typography>
                        </ListItem>
                        <Divider />
                      </>
                    )) : 
                      <div>No followers</div>}
                  </List>
                </TabPanel>
              </Box>
            </Dialog>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </>
  );
};

export default FriendsModal;