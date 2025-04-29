import React from "react";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaPhone } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import useAuth from "@/hooks/useAuth";
import Button from "@/global/components/Button";
import styles from "@/global/styles/UserControls.module.scss";

export default function UserControls() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { logout } = useAuth();

  const handleUserClick = () => {
    if (!user) {
      dispatch(openAuthModal("login"));
    }
  };

  return (
    <div className={styles.userControls}>
      <Button variant="primary" size="s">
        <FaPhone />
        Contact Us
      </Button>
      <Button variant="secondary" size="s">
        <FaShoppingCart />
      </Button>
      {!user ? (
        <Button variant="secondary" size="s" onClick={handleUserClick}>
          <FaUser />
        </Button>
      ) : (
        <Button variant="secondary" size="s" onClick={logout}>
          <FaSignOutAlt />
        </Button>
      )}
    </div>
  );
}
