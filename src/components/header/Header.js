import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import BigScreenHeader from "./BigScreenHeader";
import SmallScreenHeader from "./SmallScreenHeader";
import UserContext from "../../shared/context/userContext";

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
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setOpenLoginAlert(true);
    }
  }, [currentUser]);

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    navigate("/");
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
              <BigScreenHeader logoutUser={() => logoutUser()} />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <SmallScreenHeader logoutUser={() => logoutUser()} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {!currentUser && (
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
                  buttonElement={Link}
                  variant="text"
                  link="/login"
                  onClick={() => setOpenLoginAlert(false)}
                >
                  Login
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
