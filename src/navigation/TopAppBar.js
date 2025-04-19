import { Logout } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[200], 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[300], 1),
  },
  marginLeft: theme.spacing(1),
  width: "66%",
  [theme.breakpoints.up("sm")]: {
    width: "200px", // smaller width
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.grey[700], // icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.grey[800],
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const TopAppBar = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userMenu, setUserMenu] = useState(null);
  const location = useLocation();

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchKeyword.trim()) {
      navigate(`/search/${searchKeyword.trim()}`);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName"); // Cleanup when user logs out
    localStorage.removeItem("accessToken");
  };

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(false);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
      <AppBar
        position="fixed"
        sx={{ top: 0, backgroundColor: "#FFFFFF", padding: "5px 0" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <PrimaryButton
            disabled
            sx={{ display: { xs: "none", md: "flex", color: "#00a8ff" } }}
          >
            <Typography variant="logo">RATE IT</Typography>
          </PrimaryButton>
          {currentUser ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchKeyword}
                  onChange={onChangeSearch}
                  onKeyDown={handleSearch}
                />
              </Search>
              <IconButton component={Link} to="/notifications" color="primary">
                {location.pathname === "/notifications" ? (
                  <NotificationsIcon />
                ) : (
                  <NotificationsNoneOutlinedIcon />
                )}
              </IconButton>
              <Box>
                <IconButton onClick={handleOpenUserMenu} color="primary">
                  <SettingsIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={userMenu}
                  keepMounted
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  open={userMenu}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 4,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <MenuItem key={"logout"} onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center" onClick={() => logoutUser()}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          ) : (
            <Box>
              <PrimaryButton
                variant="contained"
                buttonElement={Link}
                link="/login"
                rightIcon={<LoginIcon />}
                width={"130px"}
                height={"40px"}
              >
                Log in
              </PrimaryButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopAppBar;
