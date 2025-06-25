
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export type UserTier = 'free' | 'premium';

type SupabaseProfile = Database['public']['Tables']['profiles']['Row'];

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  tier: UserTier;
  daily_usage: number;
  last_usage_date: string;
}

interface UserSession {
  tier: UserTier;
  dailyUsage: number;
  lastUsageDate: string;
  email?: string;
  isSignedIn: boolean;
  profile?: UserProfile;
}

export const useSupabaseUserTier = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [userSession, setUserSession] = useState<UserSession>({
    tier: 'free',
    dailyUsage: 0,
    lastUsageDate: new Date().toDateString(),
    isSignedIn: false
  });
  const [loading, setLoading] = useState(false);

  // Load user profile when authenticated
  useEffect(() => {
    if (user && session) {
      loadUserProfile();
    } else {
      // Reset to default when not authenticated
      setUserSession({
        tier: 'free',
        dailyUsage: 0,
        lastUsageDate: new Date().toDateString(),
        isSignedIn: false
      });
    }
  }, [user, session]);

  const loadUserProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        const userProfile = convertSupabaseProfileToUserProfile(profile);
        await resetDailyUsageIfNeeded(userProfile);
        setUserSession({
          tier: userProfile.tier,
          dailyUsage: userProfile.daily_usage,
          lastUsageDate: userProfile.last_usage_date,
          email: userProfile.email,
          isSignedIn: true,
          profile: userProfile
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertSupabaseProfileToUserProfile = (profile: SupabaseProfile): UserProfile => {
    return {
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      tier: profile.tier as UserTier,
      daily_usage: profile.daily_usage,
      last_usage_date: profile.last_usage_date
    };
  };

  const resetDailyUsageIfNeeded = async (profile: UserProfile) => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.last_usage_date !== today) {
      const { error } = await supabase
        .from('profiles')
        .update({
          daily_usage: 0,
          last_usage_date: today
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Error resetting daily usage:', error);
      }
    }
  };

  const incrementUsage = async () => {
    if (!user || !userSession.profile) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const newUsage = userSession.dailyUsage + 1;

      const { error } = await supabase
        .from('profiles')
        .update({
          daily_usage: newUsage,
          last_usage_date: today
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error incrementing usage:', error);
        return;
      }

      // Update local state
      setUserSession(prev => ({
        ...prev,
        dailyUsage: newUsage,
        lastUsageDate: today
      }));

      // Track usage in usage_tracking table
      await supabase
        .from('usage_tracking')
        .upsert({
          user_id: user.id,
          date: today,
          prompt_count: newUsage,
          tier: userSession.tier
        }, { onConflict: 'user_id,date' });

    } catch (error) {
      console.error('Error updating usage:', error);
    }
  };

  const getPromptLimit = () => {
    switch (userSession.tier) {
      case 'free': return 50;
      case 'premium': return 999;
      default: return 50;
    }
  };

  const canUsePrompt = () => {
    return userSession.dailyUsage < getPromptLimit();
  };

  return {
    userSession,
    loading,
    incrementUsage,
    getPromptLimit,
    canUsePrompt,
    remainingPrompts: getPromptLimit() - userSession.dailyUsage,
    loadUserProfile
  };
};
