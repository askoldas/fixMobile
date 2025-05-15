import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth, db } from '../lib/firebase.mjs';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { setUser, clearUser, logoutUser } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();

  // Fetch full user document
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data(); // includes role, fullName, legal, delivery, etc.
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          dispatch(setUser({ uid: user.uid, ...profile }));
        } else {
          dispatch(setUser({ uid: user.uid, email: user.email, role: 'customer' }));
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'customer',
    });
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return { login, signup, logout };
};

export default useAuth;
