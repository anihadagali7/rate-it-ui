import React from "react";
import { Provider } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../styles/Theme";
import UpdateProfile from "../components/profile/UpdateProfile";

const Signup = () => {
  return (
    <Provider>
      <UpdateProfile createProfile={true} updateProfile={false} />
    </Provider>
  );
};

export default Signup;
