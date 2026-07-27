import {
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  PlaylistPlay as PlaylistIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../shared/buttons/Button";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";

const Sidebar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
  };

  const navItems = useMemo(() => {
    const items = [
      {
        text: "Home",
        link: "/",
        icon: <HomeOutlinedIcon />,
        alternateIcon: <HomeIcon />,
      },
      {
        text: "Search",
        link: "/search",
        icon: <SearchIcon />,
        alternateIcon: <SearchIcon />,
      },
    ];

    if (currentUser) {
      items.push(
        {
          text: "Playlists",
          icon: <PlaylistIcon />,
          alternateIcon: <PlaylistIcon />,
          link: `/playlist/${currentUser.userName}`,
        },
        {
          text: "Wishlist",
          link: `/wishlist/${currentUser.userName}`,
          alternateIcon: <FavoriteIcon />,
          icon: <FavoriteBorderOutlinedIcon />,
        },
        {
          text: "Notifications",
          link: "/notifications",
          alternateIcon: <NotificationsIcon />,
          icon: <NotificationsNoneOutlinedIcon />,
        },
        {
          text: "Profile",
          link: `/profile/${currentUser.userName}`,
          icon: <AccountCircleOutlinedIcon />,
          alternateIcon: <AccountCircleIcon />,
        }
      );
    }

    return items;
  }, [currentUser]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box sx={{ px: 1, py: 2 }}>
        <Typography
          component={Link}
          to="/"
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: tokens.colors.accent,
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          Rate It
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {navItems.map(({ text, icon, link, alternateIcon }) => {
          const isActive = location.pathname === link;
          return (
            <ListItemButton
              key={text}
              component={Link}
              to={link}
              sx={{
                borderRadius: `${tokens.radius.button}px`,
                mb: 0.5,
                backgroundColor: isActive
                  ? tokens.colors.accentSubtle
                  : "transparent",
                "&:hover": {
                  backgroundColor: isActive
                    ? tokens.colors.accentSubtle
                    : tokens.colors.surfaceHover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? tokens.colors.accent : tokens.colors.textSecondary,
                }}
              >
                {isActive ? alternateIcon : icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? tokens.colors.accent
                    : tokens.colors.textPrimary,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", px: 2, pb: 3 }}>
        <Divider sx={{ mb: 2, borderColor: tokens.colors.border }} />
        {currentUser ? (
          <Button
            variant="ghost"
            onClick={logoutUser}
            rightIcon={<LogoutIcon />}
            sx={{ width: "100%", justifyContent: "flex-start" }}
            buttonElement={Link}
            link="/"
          >
            Log out
          </Button>
        ) : (
          <Button
            variant="primary"
            buttonElement={Link}
            link="/login"
            rightIcon={<LoginIcon />}
            sx={{ width: "100%" }}
          >
            Log in
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
