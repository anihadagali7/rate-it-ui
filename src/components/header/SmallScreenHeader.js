import { makeStyles } from "@mui/styles";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles({
  title: {
    fontFamily: "Signika Negative",
  },
  appBar: {
    backgroundColor: "#FFFFFF",
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const drawerWidth = 240;

const DisplaySmallScreenHeader = ({
  user,
  localUserLoggedIn,
  logoutUser,
}) => {
  const theme = useTheme();
  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer(open);
  };

  return (
    <>
      <>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            onClick={toggleDrawer(true)}
            color="inherit"
            sx={{ color: "#00a8ff" }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer
          anchor={"left"}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open={drawer}
          onClose={toggleDrawer(false)}
        >
          <DrawerHeader sx={{ width: "100%" }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ marginRight: "15px", marginTop: "10px" }}
            >
              {localUserLoggedIn && user && (
                <>
                  <Avatar
                    sx={{ bgcolor: "#00a8ff", textDecoration: "none" }}
                    component={Link}
                    to={`/profile/${user.userName}`}
                    onClick={toggleDrawer(false)}
                  >
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </Avatar>
                  <div>
                    <Stack direction="column">
                      <Typography>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography>@{user.userName}</Typography>
                    </Stack>
                  </div>
                </>
              )}
              <IconButton onClick={toggleDrawer(false)}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </Stack>
          </DrawerHeader>
          <Divider />
          <List onClick={() => setDrawer(false)}>
            <ListItem key={"home"} component={Link} to={"/"}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "#232b2b" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ color: "#232b2b" }}>Home</Typography>
              </ListItemText>
            </ListItem>
            <ListItem key={"search"} component={Link} to={`/search`}>
              <ListItemIcon>
                <SearchIcon sx={{ color: "#232b2b" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ color: "#232b2b" }}>Search</Typography>
              </ListItemText>
            </ListItem>
            <ListItem
              key={"profile"}
              component={Link}
              to={`/profile/${user.userName}`}
            >
              <ListItemIcon>
                <AccountCircleIcon sx={{ color: "#232b2b" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ color: "#232b2b" }}>Profile</Typography>
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List>
            {localUserLoggedIn ? (
              <ListItem
                key={"logout"}
                component={Link}
                to={"/"}
                onClick={() => {
                  logoutUser();
                  setDrawer(false);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "#232b2b" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ color: "#232b2b" }}>Logout</Typography>
                </ListItemText>
              </ListItem>
            ) : (
              <ListItem
                key={"login"}
                component={Link}
                to={"/login"}
                onClick={() => setDrawer(false)}
              >
                <ListItemIcon>
                  <LoginIcon sx={{ color: "#232b2b" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ color: "#232b2b" }}>Login</Typography>
                </ListItemText>
              </ListItem>
            )}
          </List>
        </Drawer>
      </>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          mr: 2,
          fontFamily: "Signika Negative",
          fontSize: "24px",
          color: "#00a8ff",
          textDecoration: "none",
        }}
      >
        RATE IT
      </Typography>
    </>
  );
};

export default DisplaySmallScreenHeader;
