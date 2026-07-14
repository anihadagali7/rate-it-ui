import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserContext from "../src/shared/context/userContext";
import "./App.css";
import UserClient from "./client/UserClient";
import ResponsiveLayout from "./navigation/ResponsiveLayout";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MediaInfo from "./pages/MediaInfo";
import Notifications from "./pages/Notifications";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import Protected from "./shared/Protected";
import { theme } from "./styles/Theme";
import DisplayOnePlaylist from "./components/playlist/DisplayOnePlaylist";

const App = React.memo(() => {
  const storedUser = localStorage.getItem("userName");
  const [currentUser, setCurrentUser] = useState(null);
  const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);

  const { data: userInfo, isLoading, isError } = useQuery({
    queryKey: ["appLogin", { userName: storedUser }],
    queryFn: async () => {
      const response = await UserClient.getUserInfo(storedUser);
      return response;
    },
    staleTime: 60000,
    enabled: !!storedUser,
    select: ({ data }) => data.data.user,
  });

  useEffect(() => {
    if (userInfo) {
      setCurrentUser(userInfo);
      localStorage.setItem("userName", userInfo.userName);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
      setCurrentUser(null);
    }
  }, [isError]);

  // Skip the loading gate when logged out so Home can render explore immediately
  const showApp = !storedUser || !isLoading;

  return (
    <UserContext.Provider value={value}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {showApp && (
              <>
                <ResponsiveLayout>
                  <Routes>
                    <Route exact path="/" element={<Home />}></Route>
                    <Route exact path="/search" element={<Search />}></Route>
                    <Route
                      exact
                      path="/search/:keyword"
                      element={<Search />}
                    ></Route>
                    <Route exact path="/login" element={<Login />}></Route>
                    <Route exact path="/signup" element={<Signup />}></Route>
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
                  </Routes>
                </ResponsiveLayout>
              </>
            )}
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
});

export default App;
