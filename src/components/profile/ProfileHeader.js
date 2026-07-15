import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "../../shared/buttons/Button";
import FollowButton from "../../shared/social/FollowButton";
import UserAvatar from "../../shared/primitives/UserAvatar";
import { tokens } from "../../styles/tokens";

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
    }}
  >
    <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
      <Typography
        component="span"
        sx={{ fontWeight: 600, color: tokens.colors.textPrimary }}
      >
        {count}
      </Typography>{" "}
      {label}
    </Typography>
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
          height: 72,
          backgroundColor: tokens.colors.accentSubtle,
          borderBottom: `1px solid ${tokens.colors.border}`,
        }}
      />

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Box sx={{ mt: -4, mb: 1.5 }}>
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
            gap: 1.5,
            mb: 2,
          }}
        >
          {typeof reviewCount === "number" ? (
            <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
              <Typography
                component="span"
                sx={{ fontWeight: 600, color: tokens.colors.textPrimary }}
              >
                {reviewCount}
              </Typography>{" "}
              {reviewCount === 1 ? "review" : "reviews"}
            </Typography>
          ) : null}
          <StatButton
            count={profile?.following?.length || 0}
            label="following"
            onClick={onFollowingClick}
          />
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
