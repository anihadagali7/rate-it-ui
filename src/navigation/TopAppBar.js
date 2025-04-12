import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import UserContext from "../shared/context/userContext";
import { useNavigate } from "react-router-dom";

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
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onChangeSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchKeyword.trim()) {
      navigate(`/search/${searchKeyword.trim()}`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
      <AppBar position="fixed" sx={{ top: 0, backgroundColor: "#FFFFFF" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <PrimaryButton
            disabled
            sx={{ display: { xs: "none", md: "flex", color: "#00a8ff" } }}
          >
            <Typography variant="logo">RATE IT</Typography>
          </PrimaryButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "flex-end",
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
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Add spacing below the AppBar so content doesn’t get hidden underneath */}
      <Toolbar />
    </Box>
  );
};

export default TopAppBar;
