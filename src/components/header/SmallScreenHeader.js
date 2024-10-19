import { styled, useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
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
import { Box, Grid } from "@mui/material";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const drawerWidth = 240;

const MenuDrawer = ({
  drawer,
  toggleDrawer,
  currentUser,
  theme,
  logoutUser,
  setDrawer,
}) => (
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
        {currentUser && (
          <>
            <Avatar
              sx={{ bgcolor: "#00a8ff", textDecoration: "none" }}
              component={Link}
              to={`/profile/${currentUser?.userName}`}
              onClick={toggleDrawer(false)}
            >
              {currentUser?.firstName[0]}
              {currentUser?.lastName[0]}
            </Avatar>
            <div>
              <Stack direction="column">
                <Typography>
                  {currentUser?.firstName} {currentUser?.lastName}
                </Typography>
                <Typography>@{currentUser?.userName}</Typography>
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
      <ListItem
        key={"profile"}
        component={Link}
        to={`/profile/${currentUser?.userName}`}
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
      {currentUser ? (
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
);

const SmallScreenHeader = ({ logoutUser }) => {
  const theme = useTheme();
  const [drawer, setDrawer] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { currentUser } = useContext(UserContext);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer(open);
  };

  const handleOpenSearchBar = (value) => {
    setSearchKeyword("");
    setOpenSearchBar(value);
  };

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <Grid container sx={{ padding: "0 5px" }}>
      <Grid item xs={1} container alignContent="center">
        <IconButton
          size="large"
          onClick={toggleDrawer(true)}
          color="inherit"
          sx={{ color: "#00a8ff" }}
        >
          <MenuIcon />
        </IconButton>
        <MenuDrawer
          drawer={drawer}
          toggleDrawer={toggleDrawer}
          currentUser={currentUser}
          theme={theme}
          setDrawer={setDrawer}
          logoutUser={() => logoutUser()}
        />
      </Grid>
      <Grid item xs={2} container alignContent="center">
        <Typography variant="logo">RATE IT</Typography>
      </Grid>
      <Grid item xs={9} container justifyContent="end">
        <Stack direction="row" spacing={1}>
          {openSearchBar ? (
            <Stack direction="row" spacing={1}>
              <Box sx={{ padding: "8px 0" }}>
                <PrimaryInputField
                  value={searchKeyword}
                  name="search"
                  onChange={onChangeSearch}
                />
              </Box>
              <PrimaryButton
                buttonElement={Link}
                link={searchKeyword.length > 0 && `/search/${searchKeyword}`}
                variant="text"
                onClick={() => !searchKeyword && handleOpenSearchBar(false)}
                leftIcon={<SearchIcon />}
              ></PrimaryButton>
            </Stack>
          ) : (
            <PrimaryButton
              variant="text"
              onClick={() => handleOpenSearchBar(true)}
              leftIcon={<SearchIcon />}
            ></PrimaryButton>
          )}
          {!currentUser && (
            <PrimaryButton
              variant="text"
              buttonElement={Link}
              link="/login"
              sx={{ marginLeft: "5px" }}
            >
              Log in
            </PrimaryButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SmallScreenHeader;
