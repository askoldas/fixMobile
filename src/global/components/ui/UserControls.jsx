import React from "react";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaPhone } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import { toggleCart } from "@/store/slices/uiSlice"; // 🆕 Import cart toggle action
import useAuth from "@/hooks/useAuth";
import Button from "@/global/components/base/Button";
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

  const handleCartClick = () => {
    dispatch(toggleCart()); // 🆕 Toggle cart drawer
  };

  return (
    <div className={styles.userControls}>
      <Button variant="primary" size="s">
        <FaPhone />
        Contact Us
      </Button>
      <Button variant="secondary" size="s" onClick={handleCartClick}>
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
