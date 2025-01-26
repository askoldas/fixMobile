import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const authProvider = {
  // Login function
  login: async ({ username, password }) => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error.message);
    }
  },

  // Logout function
  logout: async () => {
    try {
      await signOut(auth);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error.message);
    }
  },

  // Check if user is authenticated
  checkAuth: () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve();
        } else {
          reject("Not authenticated");
        }
      });
    });
  },

  // Check permissions (you can customize this if needed)
  checkError: (error) => Promise.resolve(),

  // Get identity of logged-in user
  getIdentity: async () => {
    const user = auth.currentUser;
    if (user) {
      return Promise.resolve({
        id: user.uid,
        fullName: user.displayName || user.email,
        email: user.email,
      });
    }
    return Promise.reject("No user logged in");
  },

  // Get user permissions (optional)
  getPermissions: () => Promise.resolve(),
};

export default authProvider;
