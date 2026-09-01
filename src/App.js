import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserContext from "../src/shared/context/userContext";
import "./App.css";
import UserClient from "./client/UserClient";
import ResponsiveLayout from "./navigation/ResponsiveLayout";
import CompleteProfile from "./pages/CompleteProfile";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MediaInfo from "./pages/MediaInfo";
import Notifications from "./pages/Notifications";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import Protected from "./shared/Protected";
import GuestOnly from "./shared/GuestOnly";
import RequireCompleteProfile from "./shared/RequireCompleteProfile";
import { theme } from "./styles/Theme";
import DisplayOnePlaylist from "./components/playlist/DisplayOnePlaylist";

const App = React.memo(() => {
  const storedUser = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");
  const [currentUser, setCurrentUser] = useState(null);
  const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);

  const { data: userInfo, isLoading, isError } = useQuery({
    queryKey: ["appLogin", { userName: storedUser, accessToken }],
    queryFn: async () => {
      // A brand-new social sign-up has no userName yet, so there's nothing
      // to look up by. Fall back to resolving the current user from their
      // token instead — otherwise refreshing mid-onboarding would leave
      // currentUser null and bounce a legitimately logged-in user to /login.
      const response = storedUser
        ? await UserClient.getUserInfo(storedUser)
        : await UserClient.getMe();
      return response;
    },
    staleTime: 60000,
    enabled: !!storedUser || !!accessToken,
    select: ({ data }) => data.data.user,
  });

  useEffect(() => {
    if (userInfo) {
      setCurrentUser(userInfo);
      if (userInfo.userName) {
        localStorage.setItem("userName", userInfo.userName);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
      setCurrentUser(null);
    }
  }, [isError]);

  // Skip the loading gate only when truly logged out (no stored userName and
  // no access token), so Home can render explore immediately. A user with an
  // access token but no stored userName yet (mid social-signup onboarding)
  // must still wait for currentUser to resolve via getMe() — otherwise
  // Protected would see a null currentUser and redirect them to /login.
  const showApp = (!storedUser && !accessToken) || !isLoading;

  return (
    <UserContext.Provider value={value}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {showApp && (
              <RequireCompleteProfile>
                <ResponsiveLayout>
                  <Routes>
                    <Route exact path="/" element={<Home />}></Route>
                    <Route exact path="/search" element={<Search />}></Route>
                    <Route
                      exact
                      path="/search/:keyword"
                      element={<Search />}
                    ></Route>
                    <Route
                      exact
                      path="/login"
                      element={
                        <GuestOnly>
                          <Login />
                        </GuestOnly>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/signup"
                      element={
                        <GuestOnly>
                          <Signup />
                        </GuestOnly>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    ></Route>
                    <Route
                      exact
                      path="/reset-password"
                      element={<ResetPasswordConfirm />}
                    ></Route>
                    <Route
                      exact
                      path="/:mediaType/:id"
                      element={<MediaInfo />}
                    ></Route>
                    <Route
                      exact
                      path="/profile/:userName"
                      element={
                        <Protected>
                          <Profile />
                        </Protected>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/profile/edit"
                      element={
                        <Protected>
                          <EditProfile />
                        </Protected>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/notifications"
                      element={
                        <Protected>
                          <Notifications />
                        </Protected>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/playlist/:userName"
                      element={
                        <Protected>
                          <Playlist />
                        </Protected>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/playlist/:userName/:playlistId"
                      element={
                        <Protected>
                          <DisplayOnePlaylist />
                        </Protected>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/wishlist/:userName"
                      element={
                        <Protected>
                          <Wishlist />
                        </Protected>
                      }
                    ></Route>
                    <Route
                      exact
                      path="/complete-profile"
                      element={
                        <Protected>
                          <CompleteProfile />
                        </Protected>
                      }
                    ></Route>
                  </Routes>
                </ResponsiveLayout>
              </RequireCompleteProfile>
            )}
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
});

export default App;
