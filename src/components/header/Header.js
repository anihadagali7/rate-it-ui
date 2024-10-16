import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAtom } from "jotai";
import { currentUser, currentlyLoggedIn } from "../../state/user";
import { Link } from "react-router-dom";
import { Alert, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import BigScreenHeader from "./BigScreenHeader";
import SmallScreenHeader from "./SmallScreenHeader";

const useStyles = makeStyles({
  title: {
    fontFamily: "Signika Negative",
  },
  appBar: {
    backgroundColor: "#FFFFFF",
  },
});

const Header = () => {
  const classes = useStyles();
  const [openLoginAlert, setOpenLoginAlert] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [localUserLoggedIn, setLocalUserLoggedIn] = useState(false);
  const [user, setUser] = useAtom(currentUser);

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      const localStorageUser = JSON.parse(user);
      setUser(localStorageUser);
      setLocalUserLoggedIn(true);
    } else {
      setLocalUserLoggedIn(false);
      setOpenLoginAlert(true);
    }
  }, [userLoggedIn]);

  const logoutUser = () => {
    localStorage.clear();
    setUserLoggedIn(false);
    setLocalUserLoggedIn(false);
  };

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                padding: "0 15px",
              }}
            >
              <BigScreenHeader
                user={user}
                localUserLoggedIn={localUserLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
                setLocalUserLoggedIn={setLocalUserLoggedIn}
                logoutUser={logoutUser}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <SmallScreenHeader
                user={user}
                localUserLoggedIn={localUserLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
                setLocalUserLoggedIn={setLocalUserLoggedIn}
                logoutUser={logoutUser}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {!localUserLoggedIn && (
        <Box sx={{ width: "100%" }}>
          <Collapse in={openLoginAlert}>
            <Alert
              severity="info"
              variant="filled"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenLoginAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              <Typography sx={{ fontSize: "13px" }}>
                Please login to get the full experience!
                <PrimaryButton
                  testId="loginErrorModal"
                  buttonElement={Link}
                  variant="text"
                  link="/login"
                  onClick={() => setOpenLoginAlert(false)}
                >
                  <Typography sx={{ color: "#fff", fontSize: "13px" }}>
                    Login
                  </Typography>
                </PrimaryButton>
              </Typography>
            </Alert>
          </Collapse>
        </Box>
      )}
    </>
  );
};

export default Header;
