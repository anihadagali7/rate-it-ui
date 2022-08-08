import React, { useState } from "react";
import { Box, Dialog, DialogTitle, StyledEngineProvider,
  ThemeProvider } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { theme } from "../Theme/Theme";
import { Provider } from "jotai";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
};

const FriendsModal = ({ open, onClose, name, followingList, followersList }) => {
  const [tabValue, setTabValue] = useState(0);

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
              <DialogTitle sx={{ fontSize: "13px", fontWeight: "bold", margin: "auto" }}>{name}</DialogTitle>
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
                  Ratings
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  Likes
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