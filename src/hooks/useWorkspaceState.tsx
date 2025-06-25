
import { useState } from "react";
import type { PromptHistoryEntry } from "@/services/supabasePromptService";

export const useWorkspaceState = () => {
  const [lazyPrompt, setLazyPrompt] = useState("");
  const [selectedTargetModels, setSelectedTargetModels] = useState<string[]>(["chatgpt"]);
  const [purposeType, setPurposeType] = useState("standard");
  const [generatedSuperPrompts, setGeneratedSuperPrompts] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryEntry[]>([]);
  const [copiedPrompts, setCopiedPrompts] = useState<Set<string>>(new Set());
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [improvementAnswers, setImprovementAnswers] = useState<{ tried: string; outcome: string; challenge: string } | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improvementQuestions, setImprovementQuestions] = useState<string[] | null>(null);
  const [userImprovementAnswers, setUserImprovementAnswers] = useState<string[] | null>(null);

  return {
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
  };
};
