import {
  AccountCircle,
  Home,
  Notifications as NotificationsIcon,
  PlaylistPlay as PlaylistIcon,
  FavoriteBorder as WishlistIcon,
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../shared/context/userContext";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";

const drawerWidth = 240;

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const bottomNavItems = [
    { label: "Home", icon: <Home />, path: "/" },
    {
      label: "Playlists",
      icon: <PlaylistIcon />,
      path: `/playlist/${currentUser?.userName}`,
    },
    {
      label: "Wishlist",
      icon: <WishlistIcon />,
      path: `/wishlist/${currentUser?.userName}`,
    },
    {
      label: "Profile",
      icon: <AccountCircle />,
      path: `/profile/${currentUser?.userName}`,
    },
  ];

  const handleNavChange = (event, newValue) => {
    navigate(bottomNavItems[newValue].path);
  };

  const currentNavIndex = bottomNavItems.findIndex(
    (item) => item.path === location.pathname
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top AppBar for mobile */}
      {isMobile && <TopAppBar />}

      {/* Sidebar for desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ p: 2 }}>
            <Sidebar />
          </Box>
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          p: 2,
          pt: isMobile ? 8 : 3, // Add spacing under top app bar
          pb: isMobile ? "70px" : 3, // Add padding above bottom nav
          overflowX: "hidden",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation for mobile */}
      {isMobile && (
        <BottomNavigation
          showLabels
          value={currentNavIndex}
          onChange={handleNavChange}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "1px solid #e0e0e0",
            zIndex: 1300,
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
};

export default ResponsiveLayout;
