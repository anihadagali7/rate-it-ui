import "./App.css";
import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Provider } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "./Theme/Theme";
import Header from "./components/header/Header";
import Signup from "./pages/Signup";
import MediaInfo from "./pages/MediaInfo";

export default class App extends Component {
  render() {
    return (
      <Provider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Header displayMenu={true} />
              <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path="/login" element={<Login />}></Route>
                <Route exact path="/signup" element={<Signup />}></Route>
                <Route exact path="/:mediaType/:id" element={<MediaInfo />}></Route>
                <Route exact path="/profile" element={<Profile />}></Route>
                <Route exact path="/playlist" element={<Login />}></Route>
                <Route exact path="/wishlist" element={<Login />}></Route>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    );
  }
}
