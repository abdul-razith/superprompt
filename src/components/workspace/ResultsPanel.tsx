
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, TrendingUp } from "lucide-react";
import { targetModels } from "./ModelSelection";
import { AnimatedPrompt } from "./AnimatedPrompt";

interface ResultsPanelProps {
  generatedSuperPrompts: Record<string, string>;
  selectedTargetModels: string[];
  copiedPrompts: Set<string>;
  onCopyPrompt: (modelId: string, prompt: string) => void;
}

export const ResultsPanel = ({
  generatedSuperPrompts,
  selectedTargetModels,
  copiedPrompts,
  onCopyPrompt,
}: ResultsPanelProps) => {
  if (Object.keys(generatedSuperPrompts).length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for AI-Enhanced Processing</h3>
          <p className="text-gray-500 mb-2">
            Enter your lazy prompt, select target models, and let our AI generate optimized super prompts.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Phase 3
            </span>
            <span className="text-purple-600 font-medium">Real-time AI optimization with 95% confidence protocol</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            AI-Enhanced Super Prompts
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Phase 3
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Optimized with real-time AI processing and 95% confidence protocol
          </p>
        </div>
        <div className="flex space-x-2">
          {selectedTargetModels.map(modelId => {
            const model = targetModels.find(m => m.id === modelId);
            return (
              <Badge key={modelId} className={model?.color}>
                {model?.name}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {selectedTargetModels.map(modelId => {
          const model = targetModels.find(m => m.id === modelId);
          const prompt = generatedSuperPrompts[modelId];
          const isCopied = copiedPrompts.has(modelId);
          
          return (
            <Card key={modelId} className="border-l-4 border-l-gradient-to-b from-blue-500 to-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-lg">{model?.name}</span>
                    <Badge variant="outline" className={model?.color}>
                      {model?.badge}
                    </Badge>
                    <span className="text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-2 py-1 rounded-full">
                      AI Enhanced
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyPrompt(modelId, prompt)}
                    className="flex items-center space-x-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Super Prompt</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  AI-optimized for {model?.strengths} • {model?.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border min-h-[30rem]">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                    <AnimatedPrompt text={prompt || ''} />
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Phase 3: AI-enhanced with real-time optimization - Copy and paste into your {model?.name} interface
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
