import { promptEnhancer } from './ai/PromptEnhancer';
import { promptAnalyzer } from './ai/PromptAnalyzer';

export class PromptProcessor {
  private static instance: PromptProcessor;

  private constructor() {}

  public static getInstance(): PromptProcessor {
    if (!PromptProcessor.instance) {
      PromptProcessor.instance = new PromptProcessor();
    }
    return PromptProcessor.instance;
  }

  public async generateSuperPrompts(
    lazyPrompt: string,
    targetModels: string[],
    purpose: string,
    userTier: 'free' | 'premium' = 'free',
    improvementAnswers?: { tried: string; outcome: string; challenge: string }
  ): Promise<Record<string, string>> {
    return promptEnhancer.generateSuperPrompts(lazyPrompt, targetModels, purpose, userTier, improvementAnswers);
  }

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
    return promptAnalyzer.analyzePromptComplexity(prompt, userTier);
  }

  public async getOptimizationSuggestions(prompt: string): Promise<string[]> {
    return promptAnalyzer.getOptimizationSuggestions(prompt);
  }
}

// Export singleton instance
export const promptProcessor = PromptProcessor.getInstance();
