import { Box, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import RatingClient from "../../client/RatingClient";
import UserClient from "../../client/UserClient";
import FollowButton from "../social/FollowButton";
import UserAvatar from "../primitives/UserAvatar";
import SurfaceCard from "../primitives/SurfaceCard";
import MediaPoster from "../primitives/MediaPoster";
import { tokens } from "../../styles/tokens";
import UserContext from "../context/userContext";

const SuggestedUserRow = ({ user, isFollowing, onFollow, onUnfollow }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1,
      }}
    >
      <UserAvatar
        src={user.picture}
        firstName={user.firstName}
        lastName={user.lastName}
        userName={user.userName}
        size="sm"
        href={`/profile/${user.userName}`}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component={Link}
          to={`/profile/${user.userName}`}
          sx={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            textDecoration: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": { color: tokens.colors.accent },
          }}
        >
          {user.firstName} {user.lastName}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: tokens.colors.textSecondary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          @{user.userName}
        </Typography>
      </Box>
      <FollowButton
        isFollowing={isFollowing}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
      />
    </Box>
  );
};

const RightRail = () => {
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => UserClient.getAllUsers(),
    staleTime: 120000,
    enabled: !!currentUser,
    select: ({ data }) => data.data,
  });

  const { data: trendingMedia = [] } = useQuery({
    queryKey: ["rightRailTrending"],
    queryFn: () => RatingClient.getAllExploreRatings(),
    staleTime: 120000,
    enabled: !!currentUser,
    select: ({ data }) => {
      const ratings = data.data.ratingsList || [];
      const seen = new Set();
      const media = [];

      for (const rating of ratings) {
        const mediaId = rating.media?.mediaId;
        if (!mediaId || seen.has(mediaId)) {
          continue;
        }
        seen.add(mediaId);
        media.push(rating.media);
        if (media.length >= 5) {
          break;
        }
      }

      return media;
    },
  });

  const suggestedUsers = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return allUsers
      .filter((user) => user.userName !== currentUser.userName)
      .slice(0, 5);
  }, [allUsers, currentUser]);

  const followUser = useMutation({
    mutationFn: (userName) => UserClient.followUser(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: currentUser?.userName }],
      });
    },
  });

  const unfollowUser = useMutation({
    mutationFn: (userName) => UserClient.unFollowUser(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({
        queryKey: ["profileInfo", { userName: currentUser?.userName }],
      });
    },
  });

  if (!currentUser) {
    return null;
  }

  return (
    <Box
      sx={{
        width: tokens.layout.rightRailWidth,
        flexShrink: 0,
        display: { xs: "none", lg: "block" },
        position: "sticky",
        top: 24,
        alignSelf: "flex-start",
      }}
    >
      {suggestedUsers.length > 0 ? (
        <SurfaceCard padding={2} sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: tokens.colors.textPrimary,
              mb: 1,
            }}
          >
            Suggested for you
          </Typography>
          {suggestedUsers.map((user) => {
            const isFollowing = user.followers?.includes(currentUser.userName);

            return (
              <SuggestedUserRow
                key={user.userName}
                user={user}
                isFollowing={isFollowing}
                onFollow={() => followUser.mutate(user.userName)}
                onUnfollow={() => unfollowUser.mutate(user.userName)}
              />
            );
          })}
        </SurfaceCard>
      ) : null}

      {trendingMedia.length > 0 ? (
        <SurfaceCard padding={2}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: tokens.colors.textPrimary,
              mb: 1.5,
            }}
          >
            Trending now
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {trendingMedia.map((media) => {
              const mediaType = media.mediaType?.toLowerCase();

              return (
                <Box
                  key={media.mediaId}
                  component={Link}
                  to={`/${mediaType}/${media.mediaId}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: `${tokens.radius.button}px`,
                    p: 0.5,
                    mx: -0.5,
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      backgroundColor: tokens.colors.surfaceHover,
                    },
                  }}
                >
                  <MediaPoster
                    src={media.picture}
                    alt={media.name}
                    width={48}
                    height={72}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: tokens.colors.textPrimary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {media.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: tokens.colors.textSecondary,
                        textTransform: "capitalize",
                      }}
                    >
                      {mediaType}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </SurfaceCard>
      ) : null}
    </Box>
  );
};

export default RightRail;
