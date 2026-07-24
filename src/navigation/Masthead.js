import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Box, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../shared/buttons/Button";
import UserAvatar from "../shared/primitives/UserAvatar";
import UserContext from "../shared/context/userContext";
import { tokens } from "../styles/tokens";

const Masthead = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const location = useLocation();

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
  };

  const links = useMemo(() => {
    const items = [
      { label: "Home", path: "/" },
      { label: "Search", path: "/search" },
    ];

    if (currentUser) {
      items.push(
        { label: "Lists", path: `/playlist/${currentUser.userName}` },
        { label: "Saved", path: `/wishlist/${currentUser.userName}` },
        { label: "You", path: `/profile/${currentUser.userName}` }
      );
    }

    return items;
  }, [currentUser]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        height: tokens.layout.mastheadHeight,
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        px: 3,
        background: "rgba(251, 252, 251, 0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: tokens.layout.pageMaxWidth,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            fontFamily: tokens.fonts.display,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: tokens.colors.textPrimary,
            textDecoration: "none",
            justifySelf: "start",
            transition: `color ${tokens.motion.quick}`,
            "&:hover": { color: tokens.colors.accent },
          }}
        >
          Rate It
        </Typography>

        <Box
          component="nav"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifySelf: "center",
          }}
        >
          {links.map((link) => {
            const active = isActive(link.path);
            return (
              <Box
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  position: "relative",
                  px: 1.75,
                  py: 1,
                  textDecoration: "none",
                  color: active
                    ? tokens.colors.textPrimary
                    : tokens.colors.textSecondary,
                  fontFamily: tokens.fonts.body,
                  fontSize: 15,
                  fontWeight: active ? 700 : 500,
                  transition: `color ${tokens.motion.quick}`,
                  "&:hover": { color: tokens.colors.textPrimary },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 4,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: tokens.colors.signal,
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: `transform ${tokens.motion.calm}`,
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                }}
              >
                {link.label}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            justifySelf: "end",
          }}
        >
          {currentUser ? (
            <>
              <Box
                component={Link}
                to="/notifications"
                aria-label="Notifications"
                sx={{
                  display: "inline-flex",
                  color: location.pathname.startsWith("/notifications")
                    ? tokens.colors.accent
                    : tokens.colors.textSecondary,
                  transition: `color ${tokens.motion.quick}`,
                  "&:hover": { color: tokens.colors.accent },
                }}
              >
                {location.pathname.startsWith("/notifications") ? (
                  <NotificationsIcon />
                ) : (
                  <NotificationsNoneOutlinedIcon />
                )}
              </Box>
              <UserAvatar
                src={currentUser.picture}
                firstName={currentUser.firstName}
                lastName={currentUser.lastName}
                userName={currentUser.userName}
                size="sm"
                href={`/profile/${currentUser.userName}`}
              />
              <Button
                variant="ghost"
                onClick={logoutUser}
                buttonElement={Link}
                link="/"
                sx={{ px: 1.5 }}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button variant="primary" buttonElement={Link} link="/login">
              Log in
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Masthead;
