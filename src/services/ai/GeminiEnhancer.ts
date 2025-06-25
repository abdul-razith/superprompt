import { supabase } from '@/integrations/supabase/client';
import { getModelSpecificOptimization } from './ModelOptimizations';
import { geminiAnalyzer } from './GeminiAnalyzer';

export class GeminiEnhancer {
  public async generateAIEnhancedPrompt(
    lazyPrompt: string,
    modelId: string,
    purpose: string,
    userTier: 'free' | 'premium' = 'free',
    improvementAnswers?: { tried: string; outcome: string; challenge: string }
  ): Promise<string> {
    try {
      // First, preprocess the lazy prompt
      const preprocessResult = await geminiAnalyzer.preprocessPrompt(lazyPrompt);
      console.log(`🔍 Preprocessing completed: ${preprocessResult.domain} domain detected`);

      const enhancementPrompt = `
You are an elite ${preprocessResult.domain} expert. Your mission is to transform this LAZY PROMPT into a comprehensive, domain-specific super prompt.

LAZY PROMPT:
${preprocessResult.correctedPrompt}

ANALYSIS:
Domain: ${preprocessResult.domain}
Intent: ${preprocessResult.intent}
Complexity: ${preprocessResult.complexity}

REQUIRED SECTIONS:
${preprocessResult.suggestedSections.map(section => `- ${section}`).join('\n')}

DOMAIN CONTEXT:
${preprocessResult.visualIndicators.domainReason}

INTENT CONTEXT:
${preprocessResult.visualIndicators.intentReason}

USER CONTEXT:
Purpose: ${purpose}
Target Model: ${modelId}
${improvementAnswers ? `
Additional Info:
- Previous attempts: ${improvementAnswers.tried}
- Desired outcome: ${improvementAnswers.outcome}
- Specific challenge: ${improvementAnswers.challenge}
`.trim() : ''}

OUTPUT REQUIREMENTS:
1. Structure the super prompt using the required sections above
2. Add visual indicators (📝, 🔍, ⚠️, etc.) to show why each section is important
3. Include domain-specific best practices and expert insights
4. Make the prompt comprehensive yet focused on the user's intent
5. Use vocabulary and frameworks specific to ${preprocessResult.domain}
6. Ensure each section builds on the previous one logically

Your super prompt should demonstrate deep expertise in ${preprocessResult.domain} while being clear and actionable.
`.trim();

      const { data, error } = await supabase.functions.invoke('gemini-enhance', {
        body: {
          enhancementPrompt,
          modelId,
          userTier,
          preprocessResult
        }
      });

      if (error) {
        console.warn('Gemini enhancement failed:', error);
        return this.generateTemplateBasedPrompt(preprocessResult);
      }

      if (data?.enhancedPrompt) {
        return data.enhancedPrompt;
      }

      return this.generateTemplateBasedPrompt(preprocessResult);

    } catch (error) {
      console.warn('Gemini enhancement error:', error);
      return this.generateTemplateBasedPrompt(lazyPrompt);
    }
  }

  private generateTemplateBasedPrompt(preprocessResult: any): string {
    const sections = preprocessResult.suggestedSections.map(section => {
      const reason = preprocessResult.visualIndicators.sectionReasons[section];
      return `
## ${section} ${this.getSectionEmoji(section)}
${reason ? `> ${reason}` : ''}

[Content for ${section}]
`.trim();
    }).join('\n\n');

    return `
# ${preprocessResult.domain.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Super Prompt

${sections}

## Quality Checklist ✅
${this.getDomainChecklist(preprocessResult.domain)}
`.trim();
  }

  private getSectionEmoji(section: string): string {
    const emojiMap: Record<string, string> = {
      'Technical Architecture': '🏗️',
      'Implementation Steps': '📝',
      'Code Examples': '💻',
      'Testing Strategy': '🧪',
      'Performance Considerations': '⚡',
      'Target Audience': '👥',
      'Content Structure': '📑',
      'Key Messages': '💡',
      'Style Guidelines': '🎨',
      'Research Requirements': '📚',
      'Research Methodology': '🔬',
      'Data Requirements': '📊',
      'Analysis Framework': '🔍',
      'Expected Outcomes': '🎯',
      'Validation Methods': '✔️',
      'Objective': '🎯',
      'Key Requirements': '📋',
      'Quality Checklist': '✅'
    };
    return emojiMap[section] || '📌';
  }

  private getDomainChecklist(domain: string): string {
    const checklists: Record<string, string[]> = {
      software_development: [
        'Code follows best practices and patterns',
        'Error handling is comprehensive',
        'Performance considerations are addressed',
        'Security measures are included',
        'Documentation is clear and complete'
      ],
      content_creation: [
        'Target audience is clearly defined',
        'Key messages are compelling',
        'Structure is logical and flows well',
        'Style is consistent and appropriate',
        'SEO considerations are addressed'
      ],
      research: [
        'Methodology is sound and justified',
        'Data requirements are clearly specified',
        'Analysis framework is appropriate',
        'Validation methods are robust',
        'Limitations are acknowledged'
      ]
    };

    return (checklists[domain] || [
      'Objectives are clearly defined',
      'Requirements are specific and measurable',
      'Instructions are clear and actionable',
      'Quality criteria are established',
      'Success metrics are defined'
    ]).map(item => `- [ ] ${item}`).join('\n');
  }

  public async generateSuperPrompts(
    lazyPrompt: string,
    targetModels: string[],
    purpose: string,
    userTier: 'free' | 'premium' = 'free',
    improvementAnswers?: { tried: string; outcome: string; challenge: string }
  ): Promise<Record<string, string>> {
    console.log(`🚀 Generating domain-specific super prompts for ${userTier} user`);

    const superPrompts: Record<string, string> = {};

    for (const modelId of targetModels) {
      try {
        const superPrompt = await this.generateAIEnhancedPrompt(
          lazyPrompt,
          modelId,
          purpose,
          userTier,
          improvementAnswers
        );
        superPrompts[modelId] = superPrompt;
      } catch (error) {
        console.warn(`Enhancement failed for ${modelId}, using template fallback:`, error);
        const preprocessResult = await geminiAnalyzer.preprocessPrompt(lazyPrompt);
        const fallbackPrompt = this.generateTemplateBasedPrompt(preprocessResult);
        superPrompts[modelId] = fallbackPrompt;
      }
    }

    return superPrompts;
  }
}

export const geminiEnhancer = new GeminiEnhancer();
