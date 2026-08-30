import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "./context/userContext";

const RequireCompleteProfile = ({ children }) => {
  const { currentUser } = useContext(UserContext);
  const location = useLocation();

  const isIncomplete = currentUser?.isProfileComplete === false;

  if (isIncomplete && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default RequireCompleteProfile;
