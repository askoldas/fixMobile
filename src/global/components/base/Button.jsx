import React from "react";
import PropTypes from "prop-types";
import styles from "@/global/components/base/button.module.scss"; // Correct import for SCSS modules

export default function Button({
  variant = "primary",
  size = "m",
  disabled = false,
  icon = null,
  children = null,
  onClick,
}) {
  // Generate className based on props
  const buttonClass = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    disabled ? styles["button--disabled"] : "",
  ]
    .filter(Boolean) // Remove any undefined or empty classes
    .join(" "); // Join classes into a single string

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {icon && <span className={styles.button__icon}>{icon}</span>}
      {children && <span className={styles.button__text}>{children}</span>}
    </button>
  );
}

// PropTypes for validation
Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary"]),
  size: PropTypes.oneOf(["s", "m", "l"]),
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

// Default props
Button.defaultProps = {
  variant: "primary",
  size: "m",
  disabled: false,
  icon: null,
  children: null,
  onClick: () => {},
};
