import React, { useContext, useState } from "react";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  PlaylistPlay as PlaylistIcon,
  FavoriteBorder as WishlistIcon,
  Notifications as NotificationsIcon,
  Person as ProfileIcon,
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const Sidebar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName"); // Cleanup when user logs out
    localStorage.removeItem("accessToken");
  };

  return (
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
      <Toolbar>
        <PrimaryButton
          buttonElement={Link}
          link="/"
          sx={{ display: { xs: "none", md: "flex", color: "#00a8ff" } }}
        >
          <Typography variant="logo">RATE IT</Typography>
        </PrimaryButton>
      </Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            { text: "Home", link: "/", icon: <HomeIcon /> },
            { text: "Search", link: "/search", icon: <SearchIcon /> },
            { text: "Playlists", icon: <PlaylistIcon /> },
            {
              text: "Wishlist",
              icon: <ProfileIcon />,
            },
            {
              text: "Notifications",
              link: "/notifications",
              icon: <NotificationsIcon />,
            },
            {
              text: "Profile",
              link: `/profile/${currentUser?.userName}`,
              icon: <ProfileIcon />,
            },
          ].map(({ text, icon, link }) => (
            <ListItem button key={text} component={Link} to={link}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          zIndex: 1300,
          alignItems: "center",
          justifyContent: "center",
          margin: "0 0 20px 20px",
        }}
      >
        {currentUser ? (
          <PrimaryButton
            variant="contained"
            buttonElement={Link}
            onClick={() => logoutUser()}
            link="/"
            rightIcon={<LogoutIcon />}
          >
            Log out
          </PrimaryButton>
        ) : (
          <PrimaryButton
            variant="contained"
            buttonElement={Link}
            link="/login"
            rightIcon={<LoginIcon />}
          >
            Log in
          </PrimaryButton>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
