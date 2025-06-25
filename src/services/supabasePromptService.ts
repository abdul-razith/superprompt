
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SupabasePrompt = Database['public']['Tables']['prompts']['Row'];

export interface PromptRecord {
  id: string;
  user_id: string;
  lazy_prompt: string;
  purpose_type: string;
  selected_models: string[];
  generated_super_prompts: Record<string, string>;
  user_tier: string;
  created_at: string;
}

export interface PromptHistoryEntry {
  id: string;
  lazyPrompt: string;
  purposeType: string;
  selectedTargetModels: string[];
  generatedSuperPrompts: Record<string, string>;
  createdAt: string;
  userTier: string;
}

export class SupabasePromptService {
  static convertSupabasePromptToPromptRecord(prompt: SupabasePrompt): PromptRecord {
    return {
      id: prompt.id,
      user_id: prompt.user_id,
      lazy_prompt: prompt.lazy_prompt,
      purpose_type: prompt.purpose_type,
      selected_models: prompt.selected_models,
      generated_super_prompts: prompt.generated_super_prompts as Record<string, string>,
      user_tier: prompt.user_tier,
      created_at: prompt.created_at
    };
  }

  static async savePrompt(
    lazyPrompt: string,
    purposeType: string,
    selectedModels: string[],
    generatedSuperPrompts: Record<string, string>,
    userTier: string
  ): Promise<{ data: PromptRecord | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('prompts')
      .insert({
        user_id: user.id,
        lazy_prompt: lazyPrompt,
        purpose_type: purposeType,
        selected_models: selectedModels,
        generated_super_prompts: generatedSuperPrompts,
        user_tier: userTier
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { 
      data: data ? this.convertSupabasePromptToPromptRecord(data) : null, 
      error 
    };
  }

  static async getUserPrompts(limit: number = 20): Promise<{ data: PromptRecord[] | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error };
    }

    return { 
      data: data ? data.map(prompt => this.convertSupabasePromptToPromptRecord(prompt)) : null, 
      error 
    };
  }

  static async deletePrompt(promptId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId);

    return { error };
  }
}
