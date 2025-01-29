import React from "react";
import { FaShoppingCart, FaUser, FaPhone } from "react-icons/fa";
import Button from "@/global/components/Button";
import styles from "@/global/styles/UserControls.module.scss"; 

export default function UserControls() {
  return (
    <div className={styles.userControls}>
      <Button variant="primary" size="s">
        <FaPhone />
        Contact Us
      </Button>
      <Button variant="secondary" size="s">
        <FaShoppingCart />
      </Button>
      <Button variant="secondary" size="s">
        <FaUser />
      </Button>
    </div>
  );
}
