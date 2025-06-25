import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, BadgeCheck, Brain, Search, Sparkle, PenSquare, Code2 } from "lucide-react";

interface PromptInputProps {
  lazyPrompt: string;
  onLazyPromptChange: (value: string) => void;
  purposeType: string;
  onPurposeTypeChange: (value: string) => void;
  onProcessPrompt: () => void;
  isProcessing: boolean;
}

const purposeTypes = [
  {
    id: "standard",
    name: "Standard",
    description: "General purpose optimization",
    icon: BadgeCheck,
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Enhanced logical thinking",
    icon: Brain,
  },
  {
    id: "research",
    name: "Deep Research",
    description: "Comprehensive analysis",
    icon: Search,
  },
  {
    id: "brainstorming",
    name: "Brainstorming",
    description: "Creative idea generation",
    icon: Sparkle,
  },
  {
    id: "drafting",
    name: "Content Creation",
    description: "Writing and content generation",
    icon: PenSquare,
  },
  {
    id: "code",
    name: "Code Generation",
    description: "Programming and development",
    icon: Code2,
  }
];

export const PromptInput = ({
  lazyPrompt,
  onLazyPromptChange,
  purposeType,
  onPurposeTypeChange,
  onProcessPrompt,
  isProcessing,
}: PromptInputProps) => {
  const selectedPurpose = purposeTypes.find(pt => pt.id === purposeType);

  return (
    <div className="relative w-full">
      <Textarea
        placeholder="I want a prompt that will..."
        value={lazyPrompt}
        onChange={(e) => onLazyPromptChange(e.target.value)}
        className="min-h-36 resize-none p-6 pr-20 pb-14 text-base bg-white/80 border-2 border-gray-300/80 focus:border-purple-400 focus-visible:ring-purple-400/50 rounded-2xl shadow-lg transition-all"
      />

      <div className="absolute bottom-4 left-5">
        <Select value={purposeType} onValueChange={onPurposeTypeChange}>
          <SelectTrigger className="bg-transparent border-0 shadow-none focus:ring-0 p-0 h-auto">
            <SelectValue>
              {selectedPurpose && (
                <span className="flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-100/50 rounded-md p-2 transition-colors">
                  <selectedPurpose.icon className="h-4 w-4" />
                  {selectedPurpose.name}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {purposeTypes.map(purpose => (
              <SelectItem key={purpose.id} value={purpose.id}>
                <div className="flex items-center gap-2">
                  <purpose.icon className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{purpose.name}</div>
                    <div className="text-xs text-gray-500">{purpose.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={onProcessPrompt} 
        disabled={isProcessing}
        size="icon"
        className="absolute bottom-4 right-4 w-11 h-11 rounded-lg bg-gray-700 hover:bg-gray-800 text-white shadow-md transition-all hover:scale-105"
      >
        {isProcessing ? (
          <RefreshCw className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};
