
import { PromptInput } from "@/components/workspace/PromptInput";
import { ResultsPanel } from "@/components/workspace/ResultsPanel";
import { PremiumWaitlistModal } from "@/components/auth/PremiumWaitlistModal";
import { SuperPromptImprovementPanel } from "./SuperPromptImprovementPanel";

interface WorkspaceLayoutProps {
  // Prompt input
  lazyPrompt: string;
  onLazyPromptChange: (value: string) => void;
  purposeType: string;
  onPurposeTypeChange: (value: string) => void;
  onProcessPrompt: () => void;
  isProcessing: boolean;
  
  // Model selection
  selectedTargetModels: string[];
  
  // Results
  generatedSuperPrompts: Record<string, string>;
  copiedPrompts: Set<string>;
  onCopyPrompt: (modelId: string, prompt: string) => void;
  
  // Modals
  showWaitlistModal: boolean;
  setShowWaitlistModal: (show: boolean) => void;

  handleImproveSuperPrompt?: (answers: string[]) => void;
  isImproving?: boolean;
  improvementQuestions?: string[] | null;
}

export const WorkspaceLayout = ({
  lazyPrompt,
  onLazyPromptChange,
  purposeType,
  onPurposeTypeChange,
  onProcessPrompt,
  isProcessing,
  selectedTargetModels,
  generatedSuperPrompts,
  copiedPrompts,
  onCopyPrompt,
  showWaitlistModal,
  setShowWaitlistModal,
  handleImproveSuperPrompt,
  isImproving,
  improvementQuestions
}: WorkspaceLayoutProps) => {
  const shouldShowImprovementPanel =
    handleImproveSuperPrompt &&
    improvementQuestions &&
    improvementQuestions.length > 0 &&
    Object.keys(generatedSuperPrompts).length > 0;

  const hasGeneratedPrompts = Object.keys(generatedSuperPrompts).length > 0;

  return (
    <>
      {!hasGeneratedPrompts ? (
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 animate-fade-in">
              Turn your lazy prompts into great ones
            </h1>
            <p className="mt-4 text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Idea to prompt in seconds - get much better results from Gemini
            </p>
            <div className="mt-8 w-full animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <PromptInput
                lazyPrompt={lazyPrompt}
                onLazyPromptChange={onLazyPromptChange}
                purposeType={purposeType}
                onPurposeTypeChange={onPurposeTypeChange}
                onProcessPrompt={onProcessPrompt}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Center Panel */}
            <div className="xl:col-span-8 space-y-6">
              <PromptInput
                lazyPrompt={lazyPrompt}
                onLazyPromptChange={onLazyPromptChange}
                purposeType={purposeType}
                onPurposeTypeChange={onPurposeTypeChange}
                onProcessPrompt={onProcessPrompt}
                isProcessing={isProcessing}
              />
              <ResultsPanel
                generatedSuperPrompts={generatedSuperPrompts}
                selectedTargetModels={selectedTargetModels}
                copiedPrompts={copiedPrompts}
                onCopyPrompt={onCopyPrompt}
              />
            </div>

            {/* Right Panel */}
            <div className="xl:col-span-4">
              {shouldShowImprovementPanel && improvementQuestions && handleImproveSuperPrompt && (
                <SuperPromptImprovementPanel
                  questions={improvementQuestions}
                  onSubmit={handleImproveSuperPrompt}
                  isSubmitting={!!isImproving}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <PremiumWaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </>
  );
};
