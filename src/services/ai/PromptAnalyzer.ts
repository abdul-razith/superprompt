
import { geminiAnalyzer } from './GeminiAnalyzer';

export class PromptAnalyzer {
  public async analyzePromptComplexity(
    prompt: string,
    userTier: 'free' | 'premium' = 'free'
  ): Promise<{
    complexity: 'simple' | 'moderate' | 'complex';
    suggestedModels: string[];
    estimatedTokens: number;
    aiConfidence: number;
    sentiment: string;
    suggestions?: string[];
  }> {
    return geminiAnalyzer.analyzePromptComplexity(prompt, userTier);
  }

  public async getOptimizationSuggestions(prompt: string): Promise<string[]> {
    return geminiAnalyzer.getOptimizationSuggestions(prompt);
  }
}

export const promptAnalyzer = new PromptAnalyzer();
