import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { atom, useAtom } from "jotai";
import { currentlyLoggedIn } from "../../state/user";
import { Link } from "react-router-dom";

const pages = ["Profile", "Wishlist", "Playlist"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const useStyles = makeStyles({
  title: {
    fontFamily: "Black Signature",
  },
  appBar: {
    backgroundColor: "#FFFFFF",
  },
});

const Header = ({ displayMenu }) => {
  const classes = useStyles();
  const [userMenu, setUserMenu] = useState(null);

  const [drawer, setDrawer] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);

  useEffect(() => {}, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer(open);
  };

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(false);
  };

  const menuDrawer = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {pages.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text === "Profile" && <AccountCircleIcon />}
                {text === "Playlist" && <PlaylistAddIcon />}
                {text === "Wishlist" && <AddTaskIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" className={classes.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* START BIG SCREEN */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Black Signature",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#00a8ff",
              textDecoration: "none",
            }}
          >
            RATE IT
          </Typography>
          {displayMenu && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="normalText" sx={{ color: "	#f195ac" }}>
                      {page === "Profile" && (
                        <>
                          <Typography
                            variant="normalText"
                            sx={{ color: "	#f195ac" }}
                          >
                            <AccountCircleIcon />
                            Profile
                          </Typography>
                        </>
                      )}
                      {page === "Playlist" && (
                        <>
                          <Typography
                            variant="normalText"
                            sx={{ color: "	#f195ac" }}
                          >
                            <PlaylistAddIcon />
                            Playlist
                          </Typography>
                        </>
                      )}
                      {page === "Wishlist" && (
                        <>
                          <Typography
                            variant="normalText"
                            sx={{ color: "	#f195ac" }}
                          >
                            <AddTaskIcon />
                            Wishlist
                          </Typography>
                        </>
                      )}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </>
          )}
          {/* END BIG SCREEN */}

          {/* START SMALL SCREEN */}
          {displayMenu && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                {/* icon */}
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleDrawer(true)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <Drawer
                anchor={"left"}
                open={drawer}
                onClose={toggleDrawer(false)}
              >
                {menuDrawer()}
              </Drawer>
            </>
          )}

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Black Signature",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#00a8ff",
              textDecoration: "none",
            }}
          >
            RATE IT
          </Typography>
          {/* END SMALL SCREEN */}

          {/* ACCOUNT ICON */}
          {displayMenu && (
            <>
              <Box sx={{ flexGrow: 0 }}>
                {userLoggedIn ? (
                  <>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={userMenu}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={userMenu}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/login"
                      startIcon={
                        <AccountCircleIcon style={{ color: "#f195ac" }} />
                      }
                    >
                      <Typography
                        variant="normalText"
                        sx={{ color: "#f195ac" }}
                      >
                        Sign In
                      </Typography>
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
