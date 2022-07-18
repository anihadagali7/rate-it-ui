import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
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
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAtom } from "jotai";
import { currentUser, currentlyLoggedIn } from "../../state/user";
import { Link } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";

const settings = ["Profile", "Account", "Logout"];

const useStyles = makeStyles({
  title: {
    fontFamily: "Black Signature",
  },
  appBar: {
    backgroundColor: "#FFFFFF",
  },
});

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#f195ac",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: "bold",
    fontSize: "16px",
    marginRight: theme.spacing(1),
    color: "#232b2b",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "& .root": {
      borderBottom: "none",
    },
    "&:hover": {
      color: "#232b2b",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#40a9ff",
      fontWeight: "bold",
      fontSize: "18px",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#40a9ff",
    },
  })
);

const Header = ({ displayMenu }) => {
  const classes = useStyles();
  const [userMenu, setUserMenu] = useState(null);

  const [drawer, setDrawer] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [user, setUser] = useAtom(currentUser);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    checkPathnameValue();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const localStorageUser = JSON.parse(localStorage.getItem("user"));
      setUser(localStorageUser);
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, []);

  const checkPathnameValue = () => {
    const { pathname } = window.location;

    if (pathname === "/profile") {
      setTabValue(0);
    } else if (pathname === "/playlist") {
      setTabValue(1);
    } else if (pathname === "/wishlist") {
      setTabValue(2);
    } else {
      console.log("current path ", pathname);
      setTabValue(false);
    }
  };

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
        <ListItem key={"home"} component={Link} to={"/"}>
          <ListItemIcon>
            <HomeIcon sx={{ color: "#232b2b" }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ color: "#232b2b" }}>Home</Typography>
          </ListItemText>
        </ListItem>
        <ListItem key={"profile"} component={Link} to={"/profile"}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: "#232b2b" }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ color: "#232b2b" }}>Profile</Typography>
          </ListItemText>
        </ListItem>
        <ListItem key={"playlist"} component={Link} to={"/playlist"}>
          <ListItemIcon>
            <PlaylistAddIcon sx={{ color: "#232b2b" }} />
          </ListItemIcon>
          <Typography sx={{ color: "#232b2b" }}>Playlist</Typography>
        </ListItem>
        <ListItem key={"wishlist"} component={Link} to={"/wishlist"}>
          <ListItemIcon>
            <AddTaskIcon sx={{ color: "#232b2b" }} />
          </ListItemIcon>
          <Typography sx={{ color: "#232b2b" }}>Wishlist</Typography>
        </ListItem>
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
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                <AntTabs
                  sx={{
                    marginLeft: "32%",
                    color: "#f195ac",
                    borderBottom: "none",
                    margin: "auto",
                  }}
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="icon label tabs example"
                  TabIndicatorProps={{ style: { background: "#f195ac" } }}
                >
                  <AntTab
                    icon={<HomeIcon />}
                    label="Home"
                    iconPosition="start"
                    component={Link}
                    to="/"
                  />
                  <AntTab
                    icon={<AccountCircleIcon />}
                    label="Profile"
                    iconPosition="start"
                    component={Link}
                    to="/profile"
                  />
                  <AntTab
                    icon={<PlaylistAddIcon />}
                    label="Playlist"
                    iconPosition="start"
                    component={Link}
                    to="/"
                  />
                  <AntTab
                    icon={<AddTaskIcon />}
                    iconPosition="start"
                    component={Link}
                    label="Wishlist"
                    to="/"
                  />
                </AntTabs>
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
                  sx={{ color: "#00a8ff" }}
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
            href="/"
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
                      <AccountCircleIcon />
                      <Typography>{user.userName}</Typography>
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
