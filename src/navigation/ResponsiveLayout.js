import {
  AccountCircle,
  Home,
  Login as LoginIcon,
  PlaylistPlay as PlaylistIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
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
import React, { useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";

const drawerWidth = tokens.layout.sidebarWidth;

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const bottomNavItems = useMemo(() => {
    if (!currentUser) {
      return [
        {
          label: "Home",
          alternateIcon: <Home />,
          icon: <HomeOutlinedIcon />,
          path: "/",
        },
        {
          label: "Search",
          icon: <SearchIcon />,
          alternateIcon: <SearchIcon />,
          path: "/search",
        },
        {
          label: "Log in",
          icon: <LoginIcon />,
          alternateIcon: <LoginIcon />,
          path: "/login",
        },
      ];
    }

    return [
      {
        label: "Home",
        alternateIcon: <Home />,
        icon: <HomeOutlinedIcon />,
        path: "/",
      },
      {
        label: "Search",
        icon: <SearchIcon />,
        alternateIcon: <SearchIcon />,
        path: "/search",
      },
      {
        label: "Playlists",
        icon: <PlaylistIcon />,
        alternateIcon: <PlaylistIcon />,
        path: `/playlist/${currentUser.userName}`,
      },
      {
        label: "Wishlist",
        icon: <FavoriteBorderOutlinedIcon />,
        alternateIcon: <FavoriteIcon />,
        path: `/wishlist/${currentUser.userName}`,
      },
      {
        label: "Profile",
        icon: <AccountCircleOutlinedIcon />,
        alternateIcon: <AccountCircle />,
        path: `/profile/${currentUser.userName}`,
      },
    ];
  }, [currentUser]);

  const handleNavChange = (event, newValue) => {
    navigate(bottomNavItems[newValue].path);
  };

  const currentNavIndex = bottomNavItems.findIndex((item) => {
    if (item.path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(item.path);
  });

  return (
    <Box sx={{ display: "flex", backgroundColor: tokens.colors.background }}>
      <CssBaseline />

      {isMobile && <TopAppBar />}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: tokens.colors.surface,
              borderRight: `1px solid ${tokens.colors.border}`,
              boxShadow: "none",
            },
          }}
        >
          <Toolbar />
          <Sidebar />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          px: { xs: 2, sm: 3 },
          pt: isMobile ? 10 : 3,
          pb: isMobile ? "80px" : 3,
          overflowX: "hidden",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>

      {isMobile && (
        <BottomNavigation
          showLabels
          value={currentNavIndex === -1 ? false : currentNavIndex}
          onChange={handleNavChange}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: `1px solid ${tokens.colors.border}`,
            backgroundColor: tokens.colors.surface,
            zIndex: 1300,
            height: 64,
            "& .MuiBottomNavigationAction-root": {
              color: tokens.colors.textMuted,
              minWidth: 0,
              paddingTop: 1,
            },
            "& .Mui-selected": {
              color: `${tokens.colors.accent} !important`,
            },
          }}
        >
          {bottomNavItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <BottomNavigationAction
                key={item.label}
                label={item.label}
                icon={isActive ? item.alternateIcon : item.icon}
              />
            );
          })}
        </BottomNavigation>
      )}
    </Box>
  );
};

export default ResponsiveLayout;
