import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { PromptHistoryEntry } from "@/services/supabasePromptService";

interface HistoryPanelProps {
  promptHistory: PromptHistoryEntry[];
  onLoadSession: (session: PromptHistoryEntry) => void;
}

export const HistoryPanel = ({ promptHistory, onLoadSession }: HistoryPanelProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Sessions</CardTitle>
        {promptHistory.length > 3 && (
          <Button asChild variant="link" className="p-0 h-auto">
            <Link to="/library">View all</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="max-h-[200px] overflow-y-auto pr-2">
        {promptHistory.length > 0 ? (
          <div className="space-y-2">
            {promptHistory.slice(0, 3).map(entry => (
              <div 
                key={entry.id} 
                className="p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onLoadSession(entry)}
              >
                <div className="text-sm font-medium line-clamp-2">{entry.lazyPrompt}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Your recent prompts will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
