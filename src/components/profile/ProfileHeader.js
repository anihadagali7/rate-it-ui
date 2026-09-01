import { useRef } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "../../shared/buttons/Button";
import FollowButton from "../../shared/social/FollowButton";
import UserAvatar from "../../shared/primitives/UserAvatar";
import { tokens } from "../../styles/tokens";
import { ALLOWED_PICTURE_TYPES } from "../../shared/constants/profilePicture";

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
  onPictureSelected,
  isUploadingPicture,
  pictureError,
}) => {
  const fileInputRef = useRef(null);
  const canUploadPicture = isOwnProfile && !!onPictureSelected;

  const handlePictureButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      onPictureSelected?.(file);
    }
  };

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
            position: "relative",
            mt: "-44px",
            mb: 1.5,
            width: 64,
            height: 64,
          }}
        >
          <Box
            sx={{
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

          {canUploadPicture ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_PICTURE_TYPES.join(",")}
                onChange={handleFileChange}
                data-testid="profile-picture-input"
                style={{ display: "none" }}
              />
              <IconButton
                aria-label="Change profile picture"
                aria-busy={isUploadingPicture}
                onClick={handlePictureButtonClick}
                disabled={isUploadingPicture}
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  zIndex: 2,
                  width: 28,
                  height: 28,
                  backgroundColor: "rgba(20, 24, 31, 0.72)",
                  color: "#FBFCFB",
                  "&:hover": { backgroundColor: tokens.colors.accent },
                }}
              >
                {isUploadingPicture ? (
                  <CircularProgress size={14} sx={{ color: "#FBFCFB" }} />
                ) : (
                  <CameraAltIcon sx={{ fontSize: 15 }} />
                )}
              </IconButton>
            </>
          ) : null}
        </Box>

        {canUploadPicture && pictureError ? (
          <Typography
            role="alert"
            sx={{
              fontSize: 12,
              color: tokens.colors.danger,
              mb: 1,
            }}
          >
            {pictureError}
          </Typography>
        ) : null}

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
