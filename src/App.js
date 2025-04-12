import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Box, StyledEngineProvider, ThemeProvider } from "@mui/material";
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
import Navbar from "./components/header/Navbar";
import Sidebar from "./components/header/Sidebar";

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
            <Layout>
              {!isLoading && (
                <>
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
                  </Routes>
                </>
              )}
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
});

export default App;

export const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Box
          sx={{
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <Sidebar />
        </Box>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden w-full">
        <Navbar />
      </div>

      {/* Main content */}
      <main style={{ flexGrow: 1 }}>{children}</main>
    </div>
  );
};
