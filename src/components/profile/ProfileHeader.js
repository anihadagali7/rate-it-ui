import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "../../shared/buttons/Button";
import FollowButton from "../../shared/social/FollowButton";
import UserAvatar from "../../shared/primitives/UserAvatar";
import { tokens } from "../../styles/tokens";

const StatDivider = () => (
  <Typography sx={{ fontSize: 14, color: tokens.colors.border }}>
    &bull;
  </Typography>
);

const StatValue = ({ count, label }) => (
  <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
    <Typography
      component="span"
      sx={{ fontWeight: 600, color: tokens.colors.textPrimary }}
    >
      {count}
    </Typography>{" "}
    {label}
  </Typography>
);

const StatButton = ({ count, label, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      border: "none",
      background: "none",
      cursor: "pointer",
      padding: 0,
      textAlign: "left",
      borderRadius: `${tokens.radius.button}px`,
      transition: `color ${tokens.motion.quick}`,
      "&:hover": {
        "& .MuiTypography-root": { color: tokens.colors.accent },
      },
    }}
  >
    <StatValue count={count} label={label} />
  </Box>
);

const ProfileHeader = ({
  profile,
  isOwnProfile,
  isFollowing,
  reviewCount,
  onFollow,
  onUnfollow,
  onFollowingClick,
  onFollowersClick,
  onAddFriends,
}) => {
  return (
    <Box
      sx={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: `${tokens.radius.card}px`,
        overflow: "hidden",
        backgroundColor: tokens.colors.surface,
        mb: 2,
      }}
    >
      <Box
        sx={{
          height: 108,
          background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentHover} 55%, ${tokens.colors.signal} 130%)`,
        }}
      />

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Box
          sx={{
            mt: "-44px",
            mb: 1.5,
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: tokens.colors.surface,
            boxShadow: tokens.shadows.soft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UserAvatar
            src={profile?.picture}
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            userName={profile?.userName}
            size="lg"
          />
        </Box>

        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: tokens.colors.textPrimary,
            lineHeight: 1.2,
          }}
        >
          {profile?.firstName} {profile?.lastName}
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: tokens.colors.textSecondary, mb: 1.5 }}
        >
          @{profile?.userName}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          {typeof reviewCount === "number" ? (
            <>
              <StatValue
                count={reviewCount}
                label={reviewCount === 1 ? "review" : "reviews"}
              />
              <StatDivider />
            </>
          ) : null}
          <StatButton
            count={profile?.following?.length || 0}
            label="following"
            onClick={onFollowingClick}
          />
          <StatDivider />
          <StatButton
            count={profile?.followers?.length || 0}
            label="followers"
            onClick={onFollowersClick}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {isOwnProfile ? (
            <>
              <Button
                variant="secondary"
                buttonElement={Link}
                link="/profile/edit"
              >
                Edit profile
              </Button>
              <Button
                variant="ghost"
                onClick={onAddFriends}
                rightIcon={<PersonAddAltIcon />}
              >
                Add friends
              </Button>
            </>
          ) : (
            <FollowButton
              isFollowing={isFollowing}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
