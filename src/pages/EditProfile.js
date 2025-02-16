import React from "react";
import ProfileDetails from "../components/profile/ProfileDetails";

const EditProfile = () => {
  return <ProfileDetails createProfile={false} updateProfile={true} />;
};

export default EditProfile;
