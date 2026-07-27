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
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";

function HideOnScroll({ children, window }) {
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const TopAppBar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(false);
  };

  return (
    <HideOnScroll>
      <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            top: 0,
            backgroundColor: tokens.colors.surface,
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: tokens.colors.accent,
                textDecoration: "none",
              }}
            >
              Rate It
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {currentUser && (
                <IconButton
                  component={Link}
                  to="/notifications"
                  sx={{ color: tokens.colors.textSecondary }}
                >
                  {location.pathname === "/notifications" ? (
                    <NotificationsIcon sx={{ color: tokens.colors.accent }} />
                  ) : (
                    <NotificationsNoneOutlinedIcon />
                  )}
                </IconButton>
              )}
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ color: tokens.colors.textSecondary }}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={userMenu}
                keepMounted
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                open={Boolean(userMenu)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1,
                    border: `1px solid ${tokens.colors.border}`,
                    borderRadius: `${tokens.radius.button}px`,
                  },
                }}
              >
                <MenuItem
                  key="auth-action"
                  onClick={() => {
                    handleCloseUserMenu();
                    if (currentUser) {
                      logoutUser();
                    }
                  }}
                  component={currentUser ? "li" : Link}
                  to={currentUser ? undefined : "/login"}
                >
                  <ListItemIcon>
                    {currentUser ? (
                      <Logout fontSize="small" />
                    ) : (
                      <LoginIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  {currentUser ? "Log out" : "Log in"}
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </HideOnScroll>
  );
};

export default TopAppBar;
