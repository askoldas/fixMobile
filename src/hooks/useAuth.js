import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth, db } from '../lib/firebase'; // Add db import
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Firestore methods
import { setUser, clearUser } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Helper: Fetch role from Firestore
  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role || 'customer'; // Fallback to 'customer' if role is missing
    }
    return 'customer';
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid); // Fetch role
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          role, // Include role in Redux state
        }));
      } else {
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

    // Write to Firestore (users collection)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'customer', // Default role
    });
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
  };

  return { login, signup, logout, loading };
};

export default useAuth;
