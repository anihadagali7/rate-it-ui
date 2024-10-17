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

const App = React.memo(() => {
  const storedUser = localStorage.getItem("user");
  const [currentUser, setCurrentUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );
  const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user"); // Cleanup when user logs out
      localStorage.removeItem("accessToken"); // Cleanup when user logs out
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={value}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Header displayMenu={true} />
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route exact path="/search/:keyword" element={<Search />}></Route>
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
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
});

export default App;
