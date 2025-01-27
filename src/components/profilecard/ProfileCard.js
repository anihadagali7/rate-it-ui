import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserClient from "../../client/UserClient";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";

const ProfileCard = ({ profile, onClose, reSearch }) => {
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const unFollowUser = useMutation({
    mutationFn: (userToUnfollow) => {
      return UserClient.unFollowUser(currentUser?.userName, userToUnfollow);
    },
    onSuccess: (userToUnfollow) => {
      resetQueries(userToUnfollow);
    },
  });

  const followUser = useMutation({
    mutationFn: (userToFollow) => {
      return UserClient.followUser(currentUser?.userName, userToFollow);
    },
    onSuccess: (userToFollow) => {
      resetQueries(userToFollow);
    },
  });

  const resetQueries = (person) => {
    reSearch();
    queryClient.invalidateQueries({
      queryKey: ["profileInfo", { userName: person }],
    });
    queryClient.invalidateQueries({
      queryKey: ["profileInfo", { userName: currentUser?.userName }],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "fullFriendsList",
        {
          userName: currentUser?.userName,
        },
      ],
    });
  };

  const determineActionButton = (profile) => {
    if (profile.userName === currentUser.userName) {
      return <></>;
    } else if (
      profile &&
      profile.followers &&
      profile.followers.includes(currentUser && currentUser.userName)
    ) {
      return (
        <PrimaryButton
          variant="outlined"
          onClick={() => unFollowUser.mutate(profile.userName)}
          width={120}
        >
          Following
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          variant="contained"
          onClick={() => followUser.mutate(profile.userName)}
          width={120}
        >
          Follow
        </PrimaryButton>
      );
    }
  };
  return (
    <>
      <ListItem>
        <Stack direction="row" spacing={2}>
          <>
            <Avatar
              onClick={onClose}
              sx={{
                bgcolor: "#00a8ff",
                textDecoration: "none",
              }}
              component={Link}
              to={`/profile/${profile.userName}`}
            >
              {profile.firstName[0]}
              {profile.lastName[0]}
            </Avatar>
            <div>
              <Stack
                direction="column"
                sx={{ textDecoration: "none" }}
                component={Link}
                onClick={onClose}
                to={`/profile/${profile.userName}`}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography>@{profile.userName}</Typography>
              </Stack>
            </div>
            <div
              style={{
                position: "absolute",
                right: "10px",
                margin: "0 0 50px 0",
              }}
            >
              {determineActionButton(profile)}
            </div>
          </>
        </Stack>
      </ListItem>
      <Divider />
    </>
  );
};

export default ProfileCard;
