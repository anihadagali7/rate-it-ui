import MuiAvatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { tokens } from "../../styles/tokens";

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
};

const getInitials = (firstName, lastName, userName) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (userName) {
    return userName.slice(0, 2).toUpperCase();
  }
  return "?";
};

const avatarSx = (dimension) => ({
  width: dimension,
  height: dimension,
  bgcolor: tokens.colors.accentSubtle,
  color: tokens.colors.accent,
  fontFamily: tokens.fonts.display,
  fontSize: dimension * 0.34,
  fontWeight: 700,
  border: `1.5px solid ${tokens.colors.border}`,
});

const UserAvatar = ({
  src,
  firstName,
  lastName,
  userName,
  size = "md",
  href,
}) => {
  const dimension = sizeMap[size] || sizeMap.md;
  const initials = getInitials(firstName, lastName, userName);

  if (href) {
    return (
      <MuiAvatar
        component={Link}
        to={href}
        src={src || undefined}
        alt={userName ? `@${userName}` : "User avatar"}
        sx={{ ...avatarSx(dimension), textDecoration: "none" }}
      >
        {!src ? initials : null}
      </MuiAvatar>
    );
  }

  return (
    <MuiAvatar
      src={src || undefined}
      alt={userName ? `@${userName}` : "User avatar"}
      sx={avatarSx(dimension)}
    >
      {!src ? initials : null}
    </MuiAvatar>
  );
};

export default UserAvatar;
