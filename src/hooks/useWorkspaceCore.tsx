
import { useSupabaseUserTier } from "@/hooks/useSupabaseUserTier";
import { useWorkspaceState } from "./useWorkspaceState";
import { useWorkspaceEffects } from "./useWorkspaceEffects";
import { useWorkspaceHandlers } from "./useWorkspaceHandlers";
import type { PromptHistoryEntry } from "@/services/supabasePromptService";

export const useWorkspaceCore = () => {
  const { userSession, getPromptLimit, remainingPrompts } = useSupabaseUserTier();
  
  // Get all state
  const {
    lazyPrompt,
    setLazyPrompt,
    selectedTargetModels,
    setSelectedTargetModels,
    purposeType,
    setPurposeType,
    generatedSuperPrompts,
    setGeneratedSuperPrompts,
    isProcessing,
    setIsProcessing,
    promptHistory,
    setPromptHistory,
    copiedPrompts,
    setCopiedPrompts,
    showWaitlistModal,
    setShowWaitlistModal,
    improvementAnswers,
    setImprovementAnswers,
    isImproving,
    setIsImproving,
    improvementQuestions,
    setImprovementQuestions,
    userImprovementAnswers,
    setUserImprovementAnswers,
  } = useWorkspaceState();

  // Handle effects
  const { loadPromptHistory } = useWorkspaceEffects({ setPromptHistory });

  // Get all handlers
  const {
    handleProcessPrompt,
    handleCopyPrompt,
    handleSave,
    handleExport,
    loadSession: baseLoadSession,
    handleImproveSuperPrompt,
  } = useWorkspaceHandlers({
    lazyPrompt,
    selectedTargetModels,
    purposeType,
    setIsProcessing,
    setGeneratedSuperPrompts,
    setImprovementQuestions,
    setUserImprovementAnswers,
    setCopiedPrompts,
    setIsImproving,
    promptHistory,
    setPromptHistory,
    loadPromptHistory,
  });

  const handleNewPrompt = () => {
    setLazyPrompt("");
    setGeneratedSuperPrompts({});
    setImprovementQuestions(null);
    setUserImprovementAnswers(null);
    setCopiedPrompts(new Set());
  };

  // Enhanced loadSession that can update state
  const loadSession = (session: PromptHistoryEntry) => {
    setLazyPrompt(session.lazyPrompt);
    setPurposeType(session.purposeType);
    setSelectedTargetModels(session.selectedTargetModels);
    setGeneratedSuperPrompts(session.generatedSuperPrompts);
    baseLoadSession(session);
  };

  // Enhanced handleExport that includes generatedSuperPrompts
  const enhancedHandleExport = () => {
    const exportData = {
      lazyPrompt,
      purposeType,
      selectedTargetModels,
      generatedSuperPrompts,
      userTier: userSession.tier,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptsync-super-prompts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    // State
    lazyPrompt,
    setLazyPrompt,
    selectedTargetModels,
    purposeType,
    setPurposeType,
    generatedSuperPrompts,
    isProcessing,
    promptHistory,
    copiedPrompts,
    showWaitlistModal,
    setShowWaitlistModal,
    
    // User session
    userSession,
    getPromptLimit,
    remainingPrompts,
    
    // Handlers
    handleProcessPrompt,
    handleCopyPrompt,
    handleSave,
    handleExport: enhancedHandleExport,
    loadSession,
    handleNewPrompt,
    improvementQuestions,
    userImprovementAnswers,
    setUserImprovementAnswers,
    handleImproveSuperPrompt,
    isImproving
  };
};
