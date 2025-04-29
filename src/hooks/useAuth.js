import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { setUser, clearUser } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Helper: Fetch role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        console.log("Fetched Firestore user data:", userDoc.data());
        return userDoc.data().role || 'customer';
      } else {
        console.log("User document not found in Firestore, defaulting role to 'customer'");
        return 'customer';
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return 'customer';
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Auth detected user:", user);

        const role = await fetchUserRole(user.uid);
        console.log("Fetched role from Firestore:", role);

        const userData = {
          uid: user.uid,
          email: user.email,
          role,
        };
        console.log("Dispatching user to Redux:", userData);

        dispatch(setUser(userData));
      } else {
        console.log("No user detected, clearing user.");
        dispatch(clearUser());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Sign in
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign up (write to Firestore after creating account)
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Signup created user:", user);

    // Write to Firestore (users collection)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'customer', // Default role
    });
    console.log("User written to Firestore with role 'customer'");
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
  };

  return { login, signup, logout, loading };
};

export default useAuth;
