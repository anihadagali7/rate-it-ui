// components/Sidebar.js
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

const drawerWidth = 240;

const Sidebar = () => {
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
            { text: "Home", icon: <HomeIcon /> },
            { text: "Search", icon: <SearchIcon /> },
            { text: "Playlists", icon: <PlaylistIcon /> },
            { text: "Wishlist", icon: <WishlistIcon /> },
            { text: "Notifications", icon: <NotificationsIcon /> },
            { text: "Profile", icon: <ProfileIcon /> },
          ].map(({ text, icon }) => (
            <ListItem button key={text}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
