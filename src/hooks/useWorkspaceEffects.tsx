import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseUserTier } from "@/hooks/useSupabaseUserTier";
import { SupabasePromptService } from "@/services/supabasePromptService";
import type { PromptHistoryEntry } from "@/services/supabasePromptService";

interface UseWorkspaceEffectsProps {
  setPromptHistory: (history: PromptHistoryEntry[]) => void;
}

export const useWorkspaceEffects = ({ setPromptHistory }: UseWorkspaceEffectsProps) => {
  const { user } = useAuth();
  const { userSession, loading: userLoading } = useSupabaseUserTier();

  // Load prompt history from Supabase for authenticated users
  useEffect(() => {
    if (user && userSession.isSignedIn) {
      loadPromptHistory();
    }
  }, [user, userSession.isSignedIn]);

  const loadPromptHistory = async () => {
    try {
      const { data, error } = await SupabasePromptService.getUserPrompts(100);
      if (error) {
        console.error('Error loading prompt history:', error);
        return;
      }
      
      if (data) {
        const formattedHistory: PromptHistoryEntry[] = data.map(prompt => ({
          id: prompt.id,
          lazyPrompt: prompt.lazy_prompt,
          purposeType: prompt.purpose_type,
          selectedTargetModels: prompt.selected_models,
          generatedSuperPrompts: prompt.generated_super_prompts,
          createdAt: prompt.created_at,
          userTier: prompt.user_tier
        }));
        setPromptHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Error loading prompt history:', error);
    }
  };

  return { loadPromptHistory };
};
