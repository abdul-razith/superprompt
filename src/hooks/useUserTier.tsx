
import { useState, useEffect } from 'react';

export type UserTier = 'free' | 'premium';

interface UserSession {
  tier: UserTier;
  dailyUsage: number;
  lastUsageDate: string;
  email?: string;
  isSignedIn: boolean;
}

export const useUserTier = () => {
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('promptsync_user_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate anonymous users to free tier
      if (parsed.tier === 'anonymous') {
        parsed.tier = 'free';
      }
      return parsed;
    }
    return {
      tier: 'free' as UserTier,
      dailyUsage: 0,
      lastUsageDate: new Date().toDateString(),
      isSignedIn: false
    };
  });

  const resetDailyUsageIfNeeded = () => {
    const today = new Date().toDateString();
    if (userSession.lastUsageDate !== today) {
      const updated = {
        ...userSession,
        dailyUsage: 0,
        lastUsageDate: today
      };
      setUserSession(updated);
      localStorage.setItem('promptsync_user_session', JSON.stringify(updated));
    }
  };

  const incrementUsage = () => {
    resetDailyUsageIfNeeded();
    const updated = {
      ...userSession,
      dailyUsage: userSession.dailyUsage + 1,
      lastUsageDate: new Date().toDateString()
    };
    setUserSession(updated);
    localStorage.setItem('promptsync_user_session', JSON.stringify(updated));
  };

  const getPromptLimit = () => {
    switch (userSession.tier) {
      case 'free': return 50;
      case 'premium': return 999;
      default: return 50;
    }
  };

  const canUsePrompt = () => {
    resetDailyUsageIfNeeded();
    return userSession.dailyUsage < getPromptLimit();
  };

  const signUp = (email: string) => {
    const updated = {
      ...userSession,
      tier: 'free' as UserTier,
      email,
      isSignedIn: true
    };
    setUserSession(updated);
    localStorage.setItem('promptsync_user_session', JSON.stringify(updated));
  };

  useEffect(() => {
    resetDailyUsageIfNeeded();
  }, []);

  return {
    userSession,
    incrementUsage,
    getPromptLimit,
    canUsePrompt,
    signUp,
    remainingPrompts: getPromptLimit() - userSession.dailyUsage
  };
};
