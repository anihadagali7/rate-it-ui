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

const App = React.memo(() => {
  const storedUser = localStorage.getItem("userName");
  const [currentUser, setCurrentUser] = useState(null);
  const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["appLogin", { userName: storedUser }],
    queryFn: async () => {
      const response = await UserClient.getUserInfo(storedUser);
      return response;
    },
    staleTime: 60000,
    select: ({ data }) => data.data.user,
  });

  useEffect(() => {
    setCurrentUser(userInfo && userInfo);

    if (currentUser) {
      localStorage.setItem("userName", currentUser.userName);
    }
  }, [userInfo]);

  return (
    <UserContext.Provider value={value}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {!isLoading && (
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
