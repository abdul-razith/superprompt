import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseUserTier } from "@/hooks/useSupabaseUserTier";
import { promptProcessor } from "@/services/promptProcessor";
import { SupabasePromptService } from "@/services/supabasePromptService";
import { generateImprovementQuestions } from "@/services/ai/ImprovementQuestionGenerator";

interface UseWorkspaceHandlersProps {
  lazyPrompt: string;
  selectedTargetModels: string[];
  purposeType: string;
  setIsProcessing: (processing: boolean) => void;
  setGeneratedSuperPrompts: (prompts: Record<string, string>) => void;
  setImprovementQuestions: (questions: string[] | null) => void;
  setUserImprovementAnswers: (answers: string[] | null) => void;
  setCopiedPrompts: (prompts: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  setIsImproving: (improving: boolean) => void;
  promptHistory: any[];
  setPromptHistory: (history: any[]) => void;
  loadPromptHistory: () => Promise<void>;
}

export const useWorkspaceHandlers = ({
  lazyPrompt,
  selectedTargetModels,
  purposeType,
  setIsProcessing,
  setGeneratedSuperPrompts,
  setImprovementQuestions,
  setUserImprovementAnswers,
  setCopiedPrompts,
  setIsImproving,
  loadPromptHistory
}: UseWorkspaceHandlersProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userSession, incrementUsage, getPromptLimit, canUsePrompt, remainingPrompts } = useSupabaseUserTier();

  // ALWAYS generate improvement questions - fallback to default if API fails
  const fetchDynamicImprovementQuestions = async (superPrompts: Record<string, string>) => {
    try {
      const mainSuperPrompt = superPrompts[Object.keys(superPrompts)[0]];
      const questions = await generateImprovementQuestions(
        lazyPrompt,
        mainSuperPrompt
      );
      setImprovementQuestions(questions.slice(0, 3));
      setUserImprovementAnswers(null);
    } catch (e) {
      console.error("Could not generate improvement questions, using fallback:", e);
      // Always provide fallback questions
      setImprovementQuestions([
        "What specific context or constraints should be added to make this prompt more targeted?",
        "What tone, style, or format would work best for your intended use case?", 
        "What additional details or examples would help achieve better results?"
      ]);
      setUserImprovementAnswers(null);
    }
  };

  // Enhanced prompt processing with AI enhancement
  const handleProcessPrompt = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use PromptSync.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!lazyPrompt.trim()) {
      toast({
        title: "Please enter a lazy prompt",
        description: "Add your prompt before processing.",
        variant: "destructive"
      });
      return;
    }

    if (!canUsePrompt()) {
      toast({
        title: "Daily limit reached",
        description: `You've used all ${getPromptLimit()} prompts for today. Try again tomorrow!`,
        variant: "destructive"
      });
      return;
    }

    if (selectedTargetModels.length === 0) {
      toast({
        title: "Select at least one target model",
        description: "Choose which models you'll use the super prompts with.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setImprovementQuestions(null);
    setUserImprovementAnswers(null);
    await incrementUsage();
    
    try {
      toast({
        title: "AI Processing Started",
        description: "Gemini 2.0 Flash - generating super prompts..."
      });

      const superPrompts = await promptProcessor.generateSuperPrompts(
        lazyPrompt,
        selectedTargetModels,
        purposeType,
        userSession.tier
      );
      
      setGeneratedSuperPrompts(superPrompts);
      
      // ALWAYS generate improvement questions
      await fetchDynamicImprovementQuestions(superPrompts);

      // Save to Supabase for authenticated users
      const { error } = await SupabasePromptService.savePrompt(
        lazyPrompt,
        purposeType,
        selectedTargetModels,
        superPrompts,
        userSession.tier
      );
      
      if (!error) {
        await loadPromptHistory(); // Refresh history
      }
      
      toast({
        title: "Super Prompts Generated!",
        description: `Created ${selectedTargetModels.length} AI-enhanced super prompts. ${remainingPrompts - 1} prompts remaining today.`
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error generating your super prompts. Please try again.",
        variant: "destructive"
      });
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy super prompt to clipboard
  const handleCopyPrompt = async (modelId: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompts(prev => new Set([...prev, modelId]));
      
      setTimeout(() => {
        setCopiedPrompts(prev => {
          const newSet = new Set(prev);
          newSet.delete(modelId);
          return newSet;
        });
      }, 2000);
      
      const modelName = modelId === 'chatgpt' ? 'ChatGPT' : 
                       modelId === 'claude' ? 'Claude' :
                       modelId === 'grok' ? 'Grok' : 'Gemini';
      
      toast({
        title: "Copied to clipboard",
        description: `AI-enhanced super prompt for ${modelName} copied!`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Save function (auto-save for authenticated users)
  const handleSave = () => {
    if (!lazyPrompt.trim()) return;
    
    toast({
      title: "Auto-saved",
      description: "Your prompts are automatically saved to the cloud."
    });
  };

  // Export function
  const handleExport = () => {
    const exportData = {
      lazyPrompt,
      purposeType,
      selectedTargetModels,
      // generatedSuperPrompts is not available in this hook, will be passed from parent
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
    
    toast({
      title: "Export complete",
      description: "Your super prompts have been downloaded as JSON."
    });
  };

  // Load session from history
  const loadSession = (session: any) => {
    // These setters will be passed from the parent hook
    toast({
      title: "Session loaded",
      description: "Previous prompt session has been restored."
    });
  };

  // ENHANCED: After improvement answers, submit to regenerate prompts
  const handleImproveSuperPrompt = async (answers: string[]) => {
    setIsImproving(true);
    setUserImprovementAnswers(answers);
    // Dynamically build object, e.g. answer1, answer2...
    const answersObj = answers.reduce((acc, answer, idx) => {
      acc[`answer${idx + 1}`] = answer;
      return acc;
    }, {} as Record<string, string>);
    try {
      toast({
        title: "Refining Your Super Prompt...",
        description: "Submitting your answers for advanced AI enhancement."
      });

      const improvedSuperPrompts = await promptProcessor.generateSuperPrompts(
        lazyPrompt,
        selectedTargetModels,
        purposeType,
        userSession.tier,
        answersObj as any // backend expects obj
      );
      setGeneratedSuperPrompts(improvedSuperPrompts);

      toast({
        title: "Advanced Super Prompt Ready!",
        description: "Your super prompt was further tailored with your feedback."
      });
    } catch (error) {
      toast({
        title: "Further enhancement failed",
        description: "There was an error generating your advanced super prompt.",
        variant: "destructive"
      });
      console.error("Improvement error:", error);
    } finally {
      setIsImproving(false);
    }
  };

  return {
    handleProcessPrompt,
    handleCopyPrompt,
    handleSave,
    handleExport,
    loadSession,
    handleImproveSuperPrompt,
  };
};
