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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";
import Masthead from "./Masthead";

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
        label: "Lists",
        icon: <PlaylistIcon />,
        alternateIcon: <PlaylistIcon />,
        path: `/playlist/${currentUser.userName}`,
      },
      {
        label: "Saved",
        icon: <FavoriteBorderOutlinedIcon />,
        alternateIcon: <FavoriteIcon />,
        path: `/wishlist/${currentUser.userName}`,
      },
      {
        label: "You",
        icon: <AccountCircleOutlinedIcon />,
        alternateIcon: <AccountCircle />,
        path: `/profile/${currentUser.userName}`,
      },
    ];
  }, [currentUser]);

  const handleNavChange = (_event, newValue) => {
    navigate(bottomNavItems[newValue].path);
  };

  const currentNavIndex = bottomNavItems.findIndex((item) => {
    if (item.path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(item.path);
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: tokens.gradients.canvas,
        backgroundAttachment: "fixed",
      }}
    >
      <CssBaseline />
      <Masthead />

      {isMobile ? (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            background: "rgba(251, 252, 251, 0.88)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              fontFamily: tokens.fonts.display,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: tokens.colors.textPrimary,
              textDecoration: "none",
            }}
          >
            Rate It
          </Typography>
        </Box>
      ) : null}

      <Box
        component="main"
        className="ri-page-enter"
        sx={{
          width: "100%",
          maxWidth: tokens.layout.pageMaxWidth,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, md: 3.5 },
          pb: isMobile ? "88px" : 5,
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>

      {isMobile ? (
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
            background: "rgba(251, 252, 251, 0.94)",
            backdropFilter: "blur(12px)",
            zIndex: 1300,
            height: 68,
            "& .MuiBottomNavigationAction-root": {
              color: tokens.colors.textMuted,
              minWidth: 0,
              paddingTop: 1,
              fontFamily: tokens.fonts.body,
            },
            "& .Mui-selected": {
              color: `${tokens.colors.accent} !important`,
            },
          }}
        >
          {bottomNavItems.map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <BottomNavigationAction
                key={item.label}
                label={item.label}
                icon={active ? item.alternateIcon : item.icon}
              />
            );
          })}
        </BottomNavigation>
      ) : null}
    </Box>
  );
};

export default ResponsiveLayout;
