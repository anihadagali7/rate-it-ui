import "./App.css";
import React, { useEffect, useState } from "react";
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

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
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
                element={
                  <Protected>
                    <MediaInfo />
                  </Protected>
                }
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
};

export default App;
