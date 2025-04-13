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

const drawerWidth = 240;

const Sidebar = () => {
  const { currentUser } = useContext(UserContext);
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
        <ListItem key={"home"} component={Link} to={"/"}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>Home</Typography>
          </ListItemText>
        </ListItem>
        <ListItem key={"search"} component={Link} to={"/search"}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>Search</Typography>
          </ListItemText>
        </ListItem>
        <List>
          {[
            { text: "Playlists", icon: <PlaylistIcon /> },
            { text: "Wishlist", icon: <WishlistIcon /> },
            { text: "Notifications", icon: <NotificationsIcon /> },
          ].map(({ text, icon }) => (
            <ListItem button key={text}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <ListItem
          key={"profile"}
          component={Link}
          to={`/profile/${currentUser?.userName}`}
        >
          <ListItemIcon>
            <ProfileIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>Profile</Typography>
          </ListItemText>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
