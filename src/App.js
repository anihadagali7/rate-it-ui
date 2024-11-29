import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "./styles/Theme";
import Header from "./components/header/Header";
import Signup from "./pages/Signup";
import MediaInfo from "./pages/MediaInfo";
import Search from "./pages/Search";
import Protected from "./shared/Protected";
import EditProfile from "./pages/EditProfile";
import UserContext from "../src/shared/context/userContext";
import { useQuery } from "@tanstack/react-query";
import UserClient from "./client/UserClient";

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
                <Header displayMenu={true} />
                <Routes>
                  <Route exact path="/" element={<Home />}></Route>
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
                  {/*<Route exact path="/playlist" element={<Login />}></Route>*/}
                  {/*<Route exact path="/wishlist" element={<Login />}></Route>*/}
                </Routes>
              </>
            )}
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
});

export default App;
