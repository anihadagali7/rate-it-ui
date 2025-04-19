import React, { useContext } from "react";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  PlaylistPlay as PlaylistIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();

  const logoutUser = () => {
    // Cleanup when user logs out
    setCurrentUser(null);
    localStorage.removeItem("userName");
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
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
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
              {
                text: "Playlists",
                icon: <PlaylistIcon />,
                alternateIcon: <PlaylistIcon />,
                link: `/playlist/${currentUser?.userName}`,
              },
              {
                text: "Wishlist",
                link: `/wishlist/${currentUser?.userName}`,
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
                link: `/profile/${currentUser?.userName}`,
                icon: <AccountCircleOutlinedIcon />,
                alternateIcon: <AccountCircleIcon />,
              },
            ].map(({ text, icon, link, alternateIcon }) => {
              const isActive = location.pathname === link;
              return (
                <ListItem
                  button
                  key={text}
                  component={Link}
                  to={link}
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive
                      ? "rgba(0, 0, 0, 0.08)"
                      : "transparent",
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "primary.main" : "inherit" }}
                  >
                    {isActive ? alternateIcon : icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box
          sx={{
            marginTop: "auto",
          }}
        >
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentUser ? (
              <PrimaryButton
                variant="text"
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
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
