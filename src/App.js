import "./App.css";
import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
            <Route exact path="/playlist" element={<Login />}></Route>
            <Route exact path="/wishlist" element={<Login />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
