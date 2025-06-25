
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { HistoryPanel } from "./HistoryPanel";
import { UsageTracker } from "./UsageTracker";
import { UserTier } from "@/hooks/useUserTier";

interface SidebarProps {
  onNewPrompt: () => void;
  promptHistory: any[];
  onLoadSession: (session: any) => void;
  userTier: UserTier;
  dailyUsage: number;
  promptLimit: number;
  remainingPrompts: number;
  onJoinWaitlist: () => void;
}

export const Sidebar = ({
  onNewPrompt,
  promptHistory,
  onLoadSession,
  userTier,
  dailyUsage,
  promptLimit,
  remainingPrompts,
  onJoinWaitlist,
}: SidebarProps) => {
  return (
    <aside className="w-80 flex-shrink-0 border-r border-gray-200 bg-white/50 p-4 flex flex-col gap-6">
      <Button onClick={onNewPrompt} className="w-full justify-start text-md py-6">
        <PlusCircle className="mr-2 h-5 w-5" />
        New Prompt
      </Button>

      <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
        <HistoryPanel 
          promptHistory={promptHistory}
          onLoadSession={onLoadSession}
        />
      </div>

      <UsageTracker
        userTier={userTier}
        dailyUsage={dailyUsage}
        promptLimit={promptLimit}
        remainingPrompts={remainingPrompts}
        onJoinWaitlist={onJoinWaitlist}
        onUpgrade={() => {}} // Prop is required but not used in the component logic
      />
    </aside>
  );
};
