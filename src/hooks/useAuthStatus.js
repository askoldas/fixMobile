import { useSelector } from "react-redux";

const useAuthStatus = () => {
  const user = useSelector((state) => state.auth.user);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return { user, isLoggedIn, isAdmin };
};

export default useAuthStatus;
