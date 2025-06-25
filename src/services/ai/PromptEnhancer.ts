import { geminiEnhancer } from './GeminiEnhancer';

export class PromptEnhancer {
  public async generateAIEnhancedPrompt(
    lazyPrompt: string, 
    modelId: string, 
    purpose: string,
    userTier: 'free' | 'premium' = 'free',
    improvementAnswers?: { tried: string; outcome: string; challenge: string }
  ): Promise<string> {
    return geminiEnhancer.generateAIEnhancedPrompt(lazyPrompt, modelId, purpose, userTier, improvementAnswers);
  }

  public async generateSuperPrompts(
    lazyPrompt: string,
    targetModels: string[],
    purpose: string,
    userTier: 'free' | 'premium' = 'free',
    improvementAnswers?: { tried: string; outcome: string; challenge: string }
  ): Promise<Record<string, string>> {
    return geminiEnhancer.generateSuperPrompts(lazyPrompt, targetModels, purpose, userTier, improvementAnswers);
  }
}

export const promptEnhancer = new PromptEnhancer();
