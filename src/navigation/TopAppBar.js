import { Logout } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../shared/context/userContext";


const TopAppBar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [userMenu, setUserMenu] = useState(null);
  const location = useLocation();

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName"); // Cleanup when user logs out
    localStorage.removeItem("accessToken");
  };

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(false);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
      <AppBar
        position="fixed"
        sx={{ top: 0, backgroundColor: "#FFFFFF", padding: "5px 0" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ width: "30%" }} variant="logo">
            RATE IT
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {currentUser && (
              <IconButton component={Link} to="/notifications" color="primary">
                {location.pathname === "/notifications" ? (
                  <NotificationsIcon />
                ) : (
                  <NotificationsNoneOutlinedIcon />
                )}
              </IconButton>
            )}
            <Box>
              <IconButton onClick={handleOpenUserMenu} color="primary">
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={userMenu}
                keepMounted
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                open={userMenu}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 4,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem key={"logout"} onClick={handleCloseUserMenu}>
                  {currentUser ? (
                    <>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        textAlign="center"
                        onClick={() => logoutUser()}
                      >
                        Logout
                      </Typography>
                    </>
                  ) : (
                    <>
                      <ListItemIcon>
                        <LoginIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography
                        textAlign="center"
                        component={Link}
                        to={`/login`}
                      >
                        Login
                      </Typography>
                    </>
                  )}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopAppBar;
