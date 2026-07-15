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

  const avatar = (
    <MuiAvatar
      src={src || undefined}
      alt={userName ? `@${userName}` : "User avatar"}
      sx={{
        width: dimension,
        height: dimension,
        bgcolor: tokens.colors.accentSubtle,
        color: tokens.colors.accent,
        fontSize: dimension * 0.38,
        fontWeight: 600,
      }}
    >
      {!src ? initials : null}
    </MuiAvatar>
  );

  if (href) {
    return (
      <MuiAvatar
        component={Link}
        to={href}
        src={src || undefined}
        alt={userName ? `@${userName}` : "User avatar"}
        sx={{
          width: dimension,
          height: dimension,
          bgcolor: tokens.colors.accentSubtle,
          color: tokens.colors.accent,
          fontSize: dimension * 0.38,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {!src ? initials : null}
      </MuiAvatar>
    );
  }

  return avatar;
};

export default UserAvatar;
