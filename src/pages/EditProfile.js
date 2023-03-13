import React, { useEffect } from "react";
import { Provider, useAtom } from "jotai";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { theme } from "../Theme/Theme";
import UpdateProfile from "../components/profile/UpdateProfile";
import { currentUser } from "../state/user";

const EditProfile = () => {
  const [user, setUser] = useAtom(currentUser);

  return (
    <Provider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <UpdateProfile createProfile={false} updateProfile={true} currentProfile={user} />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default EditProfile;
