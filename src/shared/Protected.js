import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentlyLoggedIn, currentUser } from "../state/user";

const Protected = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useAtom(currentlyLoggedIn);
  const [user, setUser] = useAtom(currentUser);
  if (!userLoggedIn && Object.keys(user).length === 0) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default Protected;
