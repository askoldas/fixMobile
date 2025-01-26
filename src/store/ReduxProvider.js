// src/store/ReduxProvider.jsx
"use client"; // Ensure this is a Client Component

import { Provider } from "react-redux";
import store from "./store"; // Adjust path to your store

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
