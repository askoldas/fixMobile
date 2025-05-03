import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth, db } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { setUser, clearUser, logoutUser } from '../store/slices/authSlice'; // ✅ Add logoutUser thunk

const useAuth = () => {
  const dispatch = useDispatch();

  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().role || 'customer';
      }
      return 'customer';
    } catch (error) {
      console.error("Error fetching user role:", error);
      return 'customer';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid);
        const userData = {
          uid: user.uid,
          email: user.email,
          role,
        };
        dispatch(setUser(userData));
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

  // ✅ Updated logout to dispatch the full logoutUser thunk
  const logout = () => {
    dispatch(logoutUser());
  };

  return { login, signup, logout };
};

export default useAuth;
