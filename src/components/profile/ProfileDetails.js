import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { isMobile } from "react-device-detect";
import Grid from "@mui/material/Grid";
import { Container, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthClient from "../../client/AuthClient";
import Divider from "@mui/material/Divider";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import ResetPassword from "./ResetPassword";
import PrimaryInputField from "../../shared/inputfield/PrimaryInputField";
import UserContext from "../../shared/context/userContext";
import { useMutation } from "@tanstack/react-query";

const initialErrorState = {
  firstName: { value: false, message: "" },
  lastName: { value: false, message: "" },
  email: { value: false, message: "" },
  userName: { value: false, message: "" },
  phoneNumber: { value: false, message: "" },
  password: { value: false, message: "" },
};

const ProfileDetails = ({ createProfile, updateProfile }) => {
  let navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [payload, setPayload] = useState({
    firstName:
      updateProfile && currentUser && currentUser.firstName
        ? currentUser.firstName
        : "",
    lastName:
      updateProfile && currentUser && currentUser.lastName
        ? currentUser.lastName
        : "",
    userName:
      updateProfile && currentUser && currentUser.userName
        ? currentUser.userName
        : "",
    email:
      updateProfile && currentUser && currentUser.email
        ? currentUser.email
        : "",
    password:
      updateProfile && currentUser && currentUser.password
        ? currentUser.password
        : "",
    phoneNumber:
      updateProfile && currentUser && currentUser.phoneNumber
        ? currentUser.phoneNumber
        : "",
  });

  const [prevProfileValues, setPrevProfileValues] = useState(payload);
  const [displayResetPassword, setDisplayResetPassword] = useState(false);
  const [errorValue, setErrorValue] = useState(initialErrorState);

  const signUp = useMutation({
    mutationFn: (newUser) => {
      return AuthClient.signUp(newUser);
    },
    onSuccess: ({ data }) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userName", data.data.user.userName);
      setCurrentUser(data.data.user);
      navigate("/");
    },
    onError: (error) => {
      let errors = error.response.data.errors;
      if (errors.msg.includes("email")) {
        errorHandler("email", true, errors.msg);
      }
      if (errors.msg.includes("username")) {
        errorHandler("userName", true, errors.msg);
      }
    },
  });

  const editProfile = useMutation({
    mutationFn: (editAccount) => {
      return AuthClient.editProfile(editAccount);
    },
    onSuccess: ({ data }) => {
      const newUserValues = data.data.user;
      setPrevProfileValues(newUserValues);
      setCurrentUser(newUserValues);
      navigate(`/profile/${currentUser.userName}`);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    const validPassword = new RegExp(
      "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
    );
    return validPassword.test(password);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.length === 10;
  };

  const errorHandler = async (id, value, message) => {
    const currentValue = JSON.parse(JSON.stringify(initialErrorState));
    currentValue[id] = { value: value, message: message };
    await setErrorValue(currentValue);
  };

  const validateInput = async () => {
    const emailValidity = isValidEmail(payload.email);
    const passwordValidity = isValidPassword(payload.password);
    const phoneNumberValidity = isValidPhoneNumber(payload.phoneNumber);
    const firstNameValidity = payload.firstName.length > 0;
    const lastNameValidity = payload.lastName.length > 0;
    const userNameValidity = payload.userName.length > 3;

    const currentValue = JSON.parse(JSON.stringify(errorValue));

    !emailValidity
      ? (currentValue["email"] = {
          value: true,
          message: "Value should be a valid email.",
        })
      : (currentValue["email"] = { value: false, message: "" });
    !passwordValidity
      ? (currentValue["password"] = {
          value: true,
          message:
            "Password should contain at least one upper case letter, one lower case letter, one special character, and one digit.",
        })
      : (currentValue["password"] = { value: false, message: "" });
    !phoneNumberValidity
      ? (currentValue["phoneNumber"] = {
          value: true,
          message: "Value should be 10 digits.",
        })
      : (currentValue["phoneNumber"] = { value: false, message: "" });
    !firstNameValidity
      ? (currentValue["firstName"] = { value: true, message: "Required" })
      : (currentValue["firstName"] = { value: false, message: "" });
    !lastNameValidity
      ? (currentValue["lastName"] = { value: true, message: "Required" })
      : (currentValue["lastName"] = { value: false, message: "" });
    !userNameValidity
      ? (currentValue["userName"] = {
          value: true,
          message: "Value must be at least 4 characters.",
        })
      : (currentValue["userName"] = { value: false, message: "" });

    await setErrorValue(currentValue);

    return (
      emailValidity &&
      passwordValidity &&
      phoneNumberValidity &&
      firstNameValidity &&
      lastNameValidity &&
      userNameValidity
    );
  };

  const checkToDisable = () => {
    const { firstName, lastName, phoneNumber, userName, email, password } =
      payload;

    const hasRequiredFields =
      firstName && lastName && userName && phoneNumber && email && password;

    // making sure new values in input field are different than what is saved
    const isSameProfile =
      prevProfileValues.firstName === firstName &&
      prevProfileValues.lastName === lastName &&
      prevProfileValues.phoneNumber === phoneNumber;

    return (
      isSameProfile ||
      !hasRequiredFields ||
      signUp.isLoading ||
      editProfile.isLoading
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setErrorValue(initialErrorState);
    const profileDetails = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      userName: payload.userName,
      password: payload.password,
      phoneNumber: payload.phoneNumber,
    };

    if (createProfile && (await validateInput())) {
      signUp.mutate(profileDetails);
    }
    if (updateProfile && (await validateInput())) {
      console.log("eiditn profiel click");
      editProfile.mutate(profileDetails);
    }
  };

  return (
    <Container maxWidth={"sm"} sx={{ marginTop: "50px" }}>
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "#FFFFFF",
          height: isMobile ? "685px" : "100%",
          borderRadius: "17px",
        }}
      >
        <Box sx={{ padding: "0 35px", minHeight: "385px" }}>
          {displayResetPassword ? (
            <ResetPassword currentProfile={currentUser} />
          ) : (
            <Box>
              <Grid
                container
                spacing={{ xs: 2, md: 2, xl: 2 }}
                columns={{ xs: 12 }}
              >
                <Grid item xs={12} sx={{ paddingBottom: "20px" }}>
                  <Typography variant="h3">
                    {createProfile ? "Create an Account" : "Edit profile"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <PrimaryInputField
                    label="First Name"
                    value={payload.firstName}
                    name="firstName"
                    required
                    onChange={(e) => handleChange(e)}
                    error={errorValue["firstName"]["value"]}
                    helperText={
                      (errorValue["firstName"]["value"] &&
                        errorValue["firstName"]["message"]) ||
                      " "
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <PrimaryInputField
                    label="Last Name"
                    value={payload.lastName}
                    name="lastName"
                    required
                    onChange={(e) => handleChange(e)}
                    error={errorValue["lastName"]["value"]}
                    helperText={
                      (errorValue["lastName"]["value"] &&
                        errorValue["lastName"]["message"]) ||
                      " "
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <PrimaryInputField
                    label="Username"
                    value={payload.userName}
                    name="userName"
                    required
                    disabled={updateProfile}
                    onChange={(e) => handleChange(e)}
                    error={errorValue["userName"]["value"]}
                    helperText={
                      (errorValue["userName"]["value"] &&
                        errorValue["userName"]["message"]) ||
                      " "
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <PrimaryInputField
                    label="Phone Number"
                    value={payload.phoneNumber}
                    name="phoneNumber"
                    required
                    onChange={(e) => handleChange(e)}
                    error={errorValue["phoneNumber"]["value"]}
                    helperText={
                      (errorValue["phoneNumber"]["value"] &&
                        errorValue["phoneNumber"]["message"]) ||
                      " "
                    }
                    placeholder={"1234567890"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PrimaryInputField
                    label="Email"
                    value={payload.email}
                    name="email"
                    required
                    disabled={updateProfile}
                    onChange={(e) => handleChange(e)}
                    error={errorValue["email"]["value"]}
                    helperText={
                      (errorValue["email"]["value"] &&
                        errorValue["email"]["message"]) ||
                      " "
                    }
                  />
                </Grid>
                {createProfile && (
                  <Grid item xs={12}>
                    <PrimaryInputField
                      label="Password"
                      value={payload.password}
                      name="password"
                      type={"password"}
                      required
                      onChange={(e) => handleChange(e)}
                      error={errorValue["password"]["value"]}
                      helperText={
                        errorValue["password"]["value"] && (
                          <>
                            <span>Password should contain at least</span>
                            <ul>
                              <li>one upper case letter</li>
                              <li>one lower case letter</li>
                              <li>one special character</li>
                              <li>one digit</li>
                            </ul>
                          </>
                        )
                      }
                    />
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="end"
                  sx={{ marginTop: "10px" }}
                >
                  <PrimaryButton
                    onClick={handleSubmit}
                    disabled={checkToDisable()}
                    variant="contained"
                  >
                    {createProfile ? "Sign Up" : "Save"}
                  </PrimaryButton>
                </Grid>
                <Grid item xs={12}>
                  <Divider
                    variant="middle"
                    sx={{
                      marginTop: "25px",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="center"
                  sx={{ marginBottom: "15px" }}
                >
                  {updateProfile && (
                    <PrimaryButton
                      testId="loginInstead"
                      variant="text"
                      onClick={() => setDisplayResetPassword(true)}
                    >
                      Reset password
                    </PrimaryButton>
                  )}
                  {createProfile && (
                    <PrimaryButton
                      testId="loginInstead"
                      buttonElement={Link}
                      variant="text"
                      link="/login"
                    >
                      Sign in instead
                    </PrimaryButton>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileDetails;
