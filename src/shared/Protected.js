import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./context/userContext";

const Protected = ({ children }) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default Protected;
