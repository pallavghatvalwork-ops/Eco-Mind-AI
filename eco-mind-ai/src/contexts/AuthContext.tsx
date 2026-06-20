'use client';

// ===========================================
// Auth Context — ECO MIND AI
// ===========================================

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '@/types/user';
import { auth, db, googleProvider } from '@/lib/firebase/client';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { BADGES } from '@/lib/utils/constants';
import { evaluateBadge } from '@/lib/utils/badgeEvaluator';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  addNotification: (title: string, message: string, type: 'streak' | 'badge' | 'challenge' | 'quiz' | 'tip', customId?: string) => void;
  markAllNotificationsAsRead: () => void;
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

  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'streak' | 'badge' | 'challenge' | 'quiz' | 'tip',
    customId?: string
  ) => {
    setUser(prev => {
      if (!prev) return null;
      const notifications = prev.notifications || [];
      
      if (customId && notifications.some(n => n.id === customId)) {
        return prev;
      }

      const newNotif = {
        id: customId || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      };

      const updatedNotifications = [newNotif, ...notifications];
      const updates = { notifications: updatedNotifications };

      const userRef = doc(db, 'users', prev.uid);
      updateDoc(userRef, updates).catch((e) => {
        console.error('Failed to update notifications in Firestore:', e);
      });

      return { ...prev, notifications: updatedNotifications };
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setUser(prev => {
      if (!prev) return null;
      const notifications = prev.notifications || [];
      
      const hasUnread = notifications.some(n => !n.read);
      if (!hasUnread) return prev;

      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      const updates = { notifications: updatedNotifications };

      const userRef = doc(db, 'users', prev.uid);
      updateDoc(userRef, updates).catch((e) => {
        console.error('Failed to mark notifications as read in Firestore:', e);
      });

      return { ...prev, notifications: updatedNotifications };
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
              journalEntriesCount: 0,
              completedChallengesCount: 0,
              billScansCount: 0,
              receiptScansCount: 0,
              simulatorScenariosCount: 0,
              communityChallengesCount: 0,
              quizCompleted: false,
              joinedChallenges: [],
              notifications: [],
              readArticles: [],
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
            journalEntriesCount: 0,
            completedChallengesCount: 0,
            billScansCount: 0,
            receiptScansCount: 0,
            simulatorScenariosCount: 0,
            communityChallengesCount: 0,
            quizCompleted: false,
            joinedChallenges: [],
            notifications: [],
            readArticles: [],
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Automatically detect badge unlocks and rotate daily tip
  useEffect(() => {
    if (!user) return;

    const stats = {
      streakDays: user.streakDays || 0,
      ecoPoints: user.ecoPoints || 0,
      carbonScore: user.carbonScore || 0,
      onboardingComplete: user.onboardingComplete || false,
      journalEntriesCount: user.journalEntriesCount || 0,
      completedChallengesCount: user.completedChallengesCount || 0,
      billScansCount: user.billScansCount || 0,
      receiptScansCount: user.receiptScansCount || 0,
      simulatorScenariosCount: user.simulatorScenariosCount || 0,
      communityChallengesCount: user.communityChallengesCount || 0,
    };

    const newNotifications: any[] = [];
    const existingNotifications = user.notifications || [];

    // Predefined Badge evaluation (BADGES criteria)
    BADGES.forEach(badge => {
      const isEarned = evaluateBadge(badge.id, stats);
      if (isEarned) {
        const notifId = `badge-unlock-${badge.id}`;
        if (!existingNotifications.some(n => n.id === notifId)) {
          newNotifications.push({
            id: notifId,
            type: 'badge',
            title: '🏆 Badge Unlocked',
            message: `${badge.name} earned!`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    // Rotate Daily Eco Tip if no tip is generated for today
    const todayStr = new Date().toDateString();
    const tipNotifId = `daily-tip-${todayStr.replace(/\s+/g, '-')}`;
    if (!existingNotifications.some(n => n.id === tipNotifId)) {
      const ECO_TIPS = [
        'Unplug devices when not in use. Standby power can account for 5-10% of household electricity usage.',
        'Wash clothes in cold water to reduce laundry energy consumption by up to 75%.',
        'Switching diet to vegetarian or vegan cuts food carbon footprint by up to 50% immediately.',
        'Consolidate online deliveries into single shipments to reduce courier transportation footprint.',
        'Composting kitchen waste prevents anaerobic methane release in landfills.',
        'Using public transit (bus/metro) twice a week instead of driving reduces transit emissions by 60%.',
      ];
      const tipIndex = new Date().getDate() % ECO_TIPS.length;
      const selectedTip = ECO_TIPS[tipIndex];
      newNotifications.push({
        id: tipNotifId,
        type: 'tip',
        title: '💡 Daily Eco Tip',
        message: selectedTip,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (newNotifications.length > 0) {
      const updatedNotifications = [...newNotifications, ...existingNotifications];
      setUser(prev => {
        if (!prev) return null;
        
        const userRef = doc(db, 'users', prev.uid);
        updateDoc(userRef, { notifications: updatedNotifications }).catch(e => {
          console.error('Failed to auto-add notifications:', e);
        });

        return { ...prev, notifications: updatedNotifications };
      });
    }
  }, [
    user?.uid,
    user?.streakDays,
    user?.carbonScore,
    user?.onboardingComplete,
    user?.journalEntriesCount,
    user?.completedChallengesCount,
    user?.billScansCount,
    user?.receiptScansCount,
    user?.simulatorScenariosCount,
    user?.communityChallengesCount,
    user?.notifications?.length
  ]);

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
        addNotification,
        markAllNotificationsAsRead,
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
