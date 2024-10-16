import { Box, Grid, Menu, MenuItem, Typography } from "@mui/material";
import PrimaryTabs from "../../shared/tabs/PrimaryTabs";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useState } from "react";
import { useAtom } from "jotai";
import { currentUser, currentlyLoggedIn } from "../../state/user";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";

const BigScreenHeader = ({}) => {
  const [userMenu, setUserMenu] = useState(null);
  const [openLoginAlert, setOpenLoginAlert] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [localUserLoggedIn, setLocalUserLoggedIn] = useState(false);
  const [user, setUser] = useAtom(currentUser);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [tabValue, setTabValue] = useState(0);

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(false);
  };

  const handleOpenSearchBar = (value) => {
    setOpenSearchBar(value);
  };

  const logoutUser = () => {
    localStorage.clear();
    setUserLoggedIn(false);
    setLocalUserLoggedIn(false);
  };

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    // logo
    // search logo -> expanded input
    // if logged in, account icon
    // else sign in button
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
        padding: "15px",
      }}
    >
      <Grid container>
        <Grid item xs={4} container alignContent="center">
          <PrimaryButton
            buttonElement={Link}
            link="/"
            sx={{ display: { xs: "none", md: "flex", color: "#00a8ff" } }}
          >
            <Typography variant="logo">RATE IT</Typography>
          </PrimaryButton>
        </Grid>
        <Grid item xs={6} container justifyContent="end">
          {openSearchBar ? (
            <Grid container>
              <Grid item xs={6}>
                <PrimaryInputField
                  value={searchKeyword}
                  name="search"
                  onChange={onChangeSearch}
                />
              </Grid>
              <Grid item xs={6} container alignContent="center">
                <PrimaryButton
                  buttonElement={Link}
                  link={`/search/${searchKeyword}`}
                  variant="text"
                  onClick={() => handleOpenSearchBar(false)}
                  leftIcon={<SearchIcon />}
                ></PrimaryButton>
              </Grid>
            </Grid>
          ) : (
            <>
              <PrimaryButton
                variant="text"
                onClick={() => handleOpenSearchBar(true)}
                leftIcon={<SearchIcon />}
              ></PrimaryButton>
            </>
          )}
        </Grid>
        <Grid item xs={2} container justifyContent="end">
          {localUserLoggedIn ? (
            <>
              <PrimaryButton variant="text" onClick={handleOpenUserMenu}>
                {user.userName}
              </PrimaryButton>
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
                <MenuItem key={"setting"} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={logoutUser}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <PrimaryButton variant="text" buttonElement={Link} link="/signup">
                Sign up
              </PrimaryButton>
              <PrimaryButton
                variant="contained"
                buttonElement={Link}
                link="/login"
                sx={{ marginLeft: "5px" }}
              >
                Log in
              </PrimaryButton>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BigScreenHeader;
