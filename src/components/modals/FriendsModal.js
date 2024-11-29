import React, { useContext, useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, Popover, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import UserClient from "../../client/UserClient";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import UserContext from "../../shared/context/userContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// TODO add a useEffect condition? with some dependency on change
// get followers only when that tab is loaded?

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
};

const FriendsModal = ({
  open,
  onClose,
  openingTab,
  displayedProfileUserName,
}) => {
  const [tabValue, setTabValue] = useState(openingTab);
  const [unfollowPopover, setUnfollowPopover] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const { currentUser } = useContext(UserContext);
  const openPopover = Boolean(unfollowPopover);
  const queryClient = useQueryClient();

  const { data: fullFriendsList } = useQuery({
    queryKey: ["fullFriendsList", { userName: displayedProfileUserName }],
    queryFn: async () => {
      const response = await UserClient.getFriendsList(
        displayedProfileUserName
      );
      return response;
    },
    staleTime: 60000,
    select: ({ data }) => data.data,
  });

  useEffect(() => {
    setFollowersList(fullFriendsList?.followersList);
    setFollowingList(fullFriendsList?.followingList);
  }, [fullFriendsList]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUnFollowPopoverClose = () => {
    setUnfollowPopover(null);
  };

  const handleUnFollowPopoverOpen = (event) => {
    setUnfollowPopover(event.currentTarget);
  };

  const displayFollowingButton = (profile) => {
    let currentlyFollows = currentUser.following.includes(profile);
    let text = currentlyFollows ? "Following" : "Follow";
    let buttonType = currentlyFollows ? "outlined" : "contained";
    return (
      <>
        <PrimaryButton
          variant={buttonType}
          // onClick={currentlyFollows ? unFollowUser.mutate(currentUser.userName, profile) : followUser.mutate(currentUser.userName, profile)}
          onClick={handleUnFollowPopoverOpen}
        >
          {text}
        </PrimaryButton>
        <Popover
          open={openPopover}
          anchorEl={unfollowPopover}
          onClose={handleUnFollowPopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <PrimaryButton variant="outlined" rightIcon={<PersonRemoveIcon />}>
            Unfollow @{profile}
          </PrimaryButton>
        </Popover>
      </>
    );
  };

  const determineActionButton = (profile) => {
    if (profile.userName === currentUser.userName) {
      return <></>;
    } else if (currentUser?.following?.includes(profile?.userName)) {
      return (
        <PrimaryButton
          variant="outlined"
          onClick={() =>
            unFollowUser.mutate({ userToUnfollow: profile.userName })
          }
        >
          Following
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          variant="contained"
          onClick={() => followUser.mutate({ userToFollow: profile.userName })}
        >
          Follow
        </PrimaryButton>
      );
    }
  };

  const unFollowUser = useMutation({
    mutationFn: (request) => {
      return UserClient.unFollowUser(
        currentUser.userName,
        request.userToUnfollow
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "fullFriendsList",
          {
            userName: currentUser.userName,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "profileInfo",
          {
            userName: currentUser.userName,
          },
        ],
      });
    },
  });

  const followUser = useMutation({
    mutationFn: (request) => {
      return UserClient.followUser(currentUser.userName, request.userToFollow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "fullFriendsList",
          {
            userName: currentUser.userName,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "profileInfo",
          {
            userName: currentUser.userName,
          },
        ],
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          height: 300,
          maxWidth: 500,
          overflowY: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "13px",
          fontWeight: "bold",
          height: "0px",
          textAlign: "center",
        }}
      >
        {displayedProfileUserName}
      </DialogTitle>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            variant="fullWidth"
            onChange={handleTabChange}
            sx={{ color: "#00a8ff" }}
            TabIndicatorProps={{ style: { background: "#00a8ff" } }}
          >
            <Tab
              sx={{
                fontSize: "13px",
                paddingLeft: "15px",
                "&.Mui-selected": {
                  color: "#40a9ff",
                  fontSize: "13px",
                },
                "&.Mui-focusVisible": {
                  backgroundColor: "#40a9ff",
                },
              }}
              label="Following"
            />
            <Tab
              sx={{
                fontSize: "13px",
                paddingLeft: "15px",
                "&.Mui-selected": {
                  color: "#40a9ff",
                  fontSize: "13px",
                },
                "&.Mui-focusVisible": {
                  backgroundColor: "#40a9ff",
                },
              }}
              label="Followers"
            />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <List component="nav" style={{ maxHeight: 200, overflow: "auto" }}>
            {followingList && followingList.length > 0 ? (
              followingList.map((profile) => (
                <>
                  <ListItem>
                    <Stack direction="row" spacing={2}>
                      <>
                        <Avatar
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
                          <Stack direction="column">
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
              ))
            ) : (
              <div>No following</div>
            )}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <List component="nav" style={{ maxHeight: 200, overflow: "auto" }}>
            {followersList && followersList.length > 0 ? (
              followersList.map((profile) => (
                <>
                  <ListItem>
                    <Stack direction="row" spacing={2}>
                      <>
                        <Avatar
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
                          <Stack direction="column">
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
              ))
            ) : (
              <div>No followers</div>
            )}
          </List>
        </TabPanel>
      </Box>
    </Dialog>
  );
};

export default FriendsModal;
