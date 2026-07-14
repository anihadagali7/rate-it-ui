import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./context/userContext";

const Protected = ({ children }) => {
  const { currentUser } = useContext(UserContext);
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
