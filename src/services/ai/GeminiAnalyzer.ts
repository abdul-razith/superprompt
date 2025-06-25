import { supabase } from '@/integrations/supabase/client';

interface PreprocessedPrompt {
  correctedPrompt: string;
  domain: string;
  intent: string;
  complexity: 'simple' | 'moderate' | 'complex';
  suggestedSections: string[];
  grammarCorrections: { original: string; corrected: string }[];
  visualIndicators: {
    domainReason: string;
    intentReason: string;
    sectionReasons: Record<string, string>;
  };
}

export class GeminiAnalyzer {
  public async analyzePromptComplexity(
    prompt: string,
    userTier: 'anonymous' | 'free' | 'premium' = 'anonymous'
  ): Promise<{
    complexity: 'simple' | 'moderate' | 'complex';
    suggestedModels: string[];
    estimatedTokens: number;
    aiConfidence: number;
    sentiment: string;
    suggestions?: string[];
  }> {
    // For anonymous users, use basic heuristic analysis
    if (userTier === 'anonymous') {
      return this.getBasicAnalysis(prompt);
    }

    try {
      console.log(`🔍 AI analyzing prompt for ${userTier} user`);
      
      const { data, error } = await supabase.functions.invoke('gemini-analyze', {
        body: {
          prompt,
          userTier: userTier as 'free' | 'premium'
        }
      });

      if (error || !data) {
        console.warn('Gemini analysis failed, using fallback:', error);
        return this.getBasicAnalysis(prompt);
      }

      console.log('✅ AI-powered analysis completed');
      return {
        complexity: data.complexity,
        suggestedModels: data.suggestedModels || ['chatgpt', 'claude'],
        estimatedTokens: data.estimatedTokens || Math.ceil(prompt.split(/\s+/).length * 1.3),
        aiConfidence: data.aiConfidence || 0.95,
        sentiment: data.sentiment || 'neutral',
        suggestions: data.suggestions || []
      };

    } catch (error) {
      console.warn('Gemini analysis error:', error);
      return this.getBasicAnalysis(prompt);
    }
  }

  private getBasicAnalysis(prompt: string): {
    complexity: 'simple' | 'moderate' | 'complex';
    suggestedModels: string[];
    estimatedTokens: number;
    aiConfidence: number;
    sentiment: string;
  } {
    const wordCount = prompt.split(/\s+/).length;
    const hasQuestions = prompt.includes('?');
    const hasMultipleTasks = prompt.split(/[,;]/).length > 2;
    const hasTechnicalTerms = /\b(code|algorithm|analysis|research|data)\b/i.test(prompt);

    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    let suggestedModels: string[] = ['chatgpt'];

    if (wordCount > 50 || hasMultipleTasks || hasTechnicalTerms) {
      complexity = 'moderate';
      suggestedModels = ['chatgpt', 'claude'];
    }

    if (wordCount > 100 || (hasQuestions && hasMultipleTasks) || hasTechnicalTerms) {
      complexity = 'complex';
      suggestedModels = ['claude', 'chatgpt', 'gemini'];
    }

    return {
      complexity,
      suggestedModels,
      estimatedTokens: Math.ceil(wordCount * 1.3),
      aiConfidence: 0.8,
      sentiment: 'neutral'
    };
  }

  public async getOptimizationSuggestions(prompt: string): Promise<string[]> {
    const suggestions: string[] = [];

    if (prompt.length < 20) {
      suggestions.push("Add more context and specific details");
    }

    if (!prompt.includes('?') && prompt.split('.').length < 2) {
      suggestions.push("Consider adding questions or breaking into multiple sentences");
    }

    if (!/\b(please|could you|would you)\b/i.test(prompt)) {
      suggestions.push("Use polite language for better AI cooperation");
    }

    if (!/\b(example|instance|for example)\b/i.test(prompt) && prompt.length > 50) {
      suggestions.push("Request examples to get more practical responses");
    }

    return suggestions;
  }

  public async preprocessPrompt(prompt: string): Promise<PreprocessedPrompt> {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-preprocess', {
        body: { prompt }
      });

      if (error || !data) {
        console.warn('Gemini preprocessing failed, using basic analysis:', error);
        return this.getBasicPreprocessing(prompt);
      }

      return data;
    } catch (error) {
      console.warn('Gemini preprocessing error:', error);
      return this.getBasicPreprocessing(prompt);
    }
  }

  private getBasicPreprocessing(prompt: string): PreprocessedPrompt {
    const lowered = prompt.toLowerCase();
    
    // Basic domain detection
    let domain = 'general';
    if (lowered.includes('code') || lowered.includes('app') || lowered.includes('develop')) {
      domain = 'software_development';
    } else if (lowered.includes('write') || lowered.includes('blog') || lowered.includes('article')) {
      domain = 'content_creation';
    } else if (lowered.includes('research') || lowered.includes('analyze') || lowered.includes('study')) {
      domain = 'research';
    }

    // Basic intent detection
    let intent = 'inform';
    if (lowered.includes('how') || lowered.includes('create') || lowered.includes('make')) {
      intent = 'instruct';
    } else if (lowered.includes('why') || lowered.includes('explain') || lowered.includes('understand')) {
      intent = 'explain';
    }

    // Basic grammar correction
    const correctedPrompt = prompt
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([a-z])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`)
      .trim()
      .replace(/^[a-z]/, c => c.toUpperCase());

    const grammarCorrections = [];
    if (correctedPrompt !== prompt) {
      grammarCorrections.push({
        original: prompt,
        corrected: correctedPrompt
      });
    }

    // Suggest sections based on domain
    const suggestedSections = this.getSuggestedSections(domain, intent);

    return {
      correctedPrompt,
      domain,
      intent,
      complexity: this.getComplexity(prompt),
      suggestedSections,
      grammarCorrections,
      visualIndicators: {
        domainReason: '',
        intentReason: '',
        sectionReasons: {}
      }
    };
  }

  private getSuggestedSections(domain: string, intent: string): string[] {
    const commonSections = ['Objective', 'Key Requirements', 'Quality Checklist'];
    
    const domainSections: Record<string, string[]> = {
      software_development: [
        'Technical Architecture',
        'Implementation Steps',
        'Code Examples',
        'Testing Strategy',
        'Performance Considerations'
      ],
      content_creation: [
        'Target Audience',
        'Content Structure',
        'Key Messages',
        'Style Guidelines',
        'Research Requirements'
      ],
      research: [
        'Research Methodology',
        'Data Requirements',
        'Analysis Framework',
        'Expected Outcomes',
        'Validation Methods'
      ]
    };

    return [...commonSections, ...(domainSections[domain] || [])];
  }

  private getComplexity(prompt: string): 'simple' | 'moderate' | 'complex' {
    const wordCount = prompt.split(/\s+/).length;
    const hasComplexTerms = /\b(integrate|analyze|optimize|architecture|framework)\b/i.test(prompt);
    
    if (wordCount > 50 || hasComplexTerms) return 'complex';
    if (wordCount > 20) return 'moderate';
    return 'simple';
  }
}

export const geminiAnalyzer = new GeminiAnalyzer();
