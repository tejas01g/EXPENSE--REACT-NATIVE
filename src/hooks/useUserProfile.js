import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export const useUserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      setError('No authenticated user');
      return;
    }

    // Set up real-time listener for user profile changes
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
          setError(null);
        } else {
          setUserInfo(null);
          setError('User profile not found');
        }
        setIsLoading(false);
      },
      (fetchError) => {
        console.error('Error fetching user profile:', fetchError);
        setError(fetchError.message);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {
    userInfo,
    isLoading,
    error,
    profileImageUrl: userInfo?.profileImageUrl,
    userName: userInfo?.name,
    userEmail: userInfo?.email,
    userDOB: userInfo?.dob,
  };
}; 