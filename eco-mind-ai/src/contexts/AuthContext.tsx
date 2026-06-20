'use client';

// ===========================================
// Auth Context — ECO MIND AI
// ===========================================

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '@/types/user';
import { auth, db, googleProvider } from '@/lib/firebase/client';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Background update Firestore user profile Snappy UI
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      
      const userRef = doc(db, 'users', prev.uid);
      updateDoc(userRef, updates).catch((e) => {
        console.error('Failed updating user document in Firestore:', e);
      });

      return updatedUser;
    });
  }, []);

  // Listen to Firebase Auth state updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data() as User);
          } else {
            // Register new user profile in Firestore
            const newUser: User = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Green Citizen',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              preferences: null,
              carbonScore: 0,
              carbonCategory: 'Green Beginner',
              ecoPoints: 100, // starting gift
              streakDays: 1,
              lastActiveDate: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              onboardingComplete: false,
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (e) {
          console.error('Error fetching/setting user profile in Firestore:', e);
          // Fallback session object for local trial
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Green Citizen',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            preferences: null,
            carbonScore: 0,
            carbonCategory: 'Green Beginner',
            ecoPoints: 100,
            streakDays: 1,
            lastActiveDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('Firebase Auth popup sign in failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error('Firebase Auth sign out failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
