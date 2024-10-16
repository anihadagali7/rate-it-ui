import { Box, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import PersonIcon from "@mui/icons-material/Person";

const BigScreenHeader = ({
  user,
  localUserLoggedIn,
  setUserLoggedIn,
  setLocalUserLoggedIn,
  logoutUser,
}) => {
  const [userMenu, setUserMenu] = useState(null);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenu(false);
  };

  const handleOpenSearchBar = (value) => {
    setSearchKeyword("");
    setOpenSearchBar(value);
  };

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
        padding: "0 15px",
      }}
    >
      <Grid container>
        <Grid item xs={2} container alignContent="center">
          <PrimaryButton
            buttonElement={Link}
            link="/"
            sx={{ display: { xs: "none", md: "flex", color: "#00a8ff" } }}
          >
            <Typography variant="logo">RATE IT</Typography>
          </PrimaryButton>
        </Grid>
        <Grid item xs={10} container justifyContent="end">
          <Stack direction="row" spacing={1}>
            {openSearchBar ? (
              <Stack direction="row" spacing={1}>
                <PrimaryInputField
                  value={searchKeyword}
                  name="search"
                  onChange={onChangeSearch}
                />
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
            {localUserLoggedIn ? (
              <Box>
                <PrimaryButton
                  variant="text"
                  onClick={handleOpenUserMenu}
                  leftIcon={<PersonIcon />}
                ></PrimaryButton>
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
                    <Typography textAlign="center" onClick={logoutUser()}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Stack direction="row" spacing={3}>
                <PrimaryButton
                  variant="text"
                  buttonElement={Link}
                  link="/signup"
                >
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
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BigScreenHeader;
