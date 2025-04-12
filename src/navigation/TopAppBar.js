import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, InputBase, Toolbar, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React from "react";
import PrimaryButton from "../shared/buttons/PrimaryButton";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "75%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const TopAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
      <AppBar position="fixed" sx={{ top: 0, backgroundColor: "#FFFFFF" }}>
        <Toolbar>
          <PrimaryButton
            disabled
            sx={{ display: { xs: "none", md: "flex", color: "#00a8ff" } }}
          >
            <Typography variant="logo">RATE IT</Typography>
          </PrimaryButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      {/* Add spacing below the AppBar so content doesn’t get hidden underneath */}
      <Toolbar />
    </Box>
  );
};

export default TopAppBar;
