
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Sidebar } from "@/components/workspace/Sidebar";

const Workspace = () => {
  const {
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
    handleExport,
    loadSession,
    handleNewPrompt,
    
    // Improvement
    improvementQuestions,
    handleImproveSuperPrompt,
    isImproving
  } = useWorkspace();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex">
      <Sidebar
        onNewPrompt={handleNewPrompt}
        promptHistory={promptHistory}
        onLoadSession={loadSession}
        userTier={userSession.tier}
        dailyUsage={userSession.dailyUsage}
        promptLimit={getPromptLimit()}
        remainingPrompts={remainingPrompts}
        onJoinWaitlist={() => setShowWaitlistModal(true)}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <WorkspaceHeader
          onSave={handleSave}
          onExport={handleExport}
        />
        <WorkspaceLayout
          lazyPrompt={lazyPrompt}
          onLazyPromptChange={setLazyPrompt}
          purposeType={purposeType}
          onPurposeTypeChange={setPurposeType}
          onProcessPrompt={handleProcessPrompt}
          isProcessing={isProcessing}
          selectedTargetModels={selectedTargetModels}
          generatedSuperPrompts={generatedSuperPrompts}
          copiedPrompts={copiedPrompts}
          onCopyPrompt={handleCopyPrompt}
          showWaitlistModal={showWaitlistModal}
          setShowWaitlistModal={setShowWaitlistModal}
          improvementQuestions={improvementQuestions}
          handleImproveSuperPrompt={handleImproveSuperPrompt}
          isImproving={isImproving}
        />
      </div>
    </div>
  );
};

export default Workspace;
