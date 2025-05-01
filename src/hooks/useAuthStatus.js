import { useSelector } from "react-redux";

const useAuthStatus = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading); // ✅ new

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return { user, isLoggedIn, isAdmin, loading }; // ✅ include loading
};

export default useAuthStatus;
