import React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import { Home, Search, AccountCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";

const drawerWidth = 240;

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  const bottomNavItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Explore", icon: <Search />, path: "/explore" },
    { label: "Profile", icon: <AccountCircle />, path: "/profile" },
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
      {isMobile && <TopAppBar />}

      {/* Sidebar for desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          pb: isMobile ? "56px" : 0,
          marginTop: isMobile ? "40px" : "-75px",
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Bottom nav for mobile */}
      {isMobile && (
        <>
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
        </>
      )}
    </Box>
  );
};

export default ResponsiveLayout;
