import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnhanceRequest {
  lazyPrompt: string;
  modelId: string;
  purpose: string;
  userTier: 'free' | 'premium';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lazyPrompt, modelId, purpose, userTier }: EnhanceRequest = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Select model based on user tier
    const geminiModel = userTier === 'premium' ? 'gemini-2.0-flash-exp' : 'gemini-1.5-flash';
    
    console.log(`Enhancing prompt for ${userTier} user with ${geminiModel}`);

    // ADVANCED DOMAIN-SPECIFIC ENHANCEMENT FRAMEWORK v3
    // - Explicitly infer the user's topic, intent, and real goal
    // - Assign a relevant expert role (mental health, business, tech, etc.)
    // - Generate a comprehensive, actionable plan using frameworks relevant for that topic

    const enhancementPrompt = `
You are an elite domain prompt strategist. Your mission is to take the LAZY PROMPT provided below and follow these expert steps:

1. Analyze and INFER the true topic and domain (e.g., addiction recovery, coding, business, creative writing, education, etc.).
2. Assign an expert persona and professional tone RELEVANT to the user's topic and actual intent (e.g., therapist for recovery, business consultant for strategy, etc.).
3. Rewrite and expand the user's lazy prompt into a detailed, domain-specific super prompt, ready for real-world use—correct mistakes, infer what the user MEANT, and add meaningful detail.
4. Use effective frameworks for that topic (e.g., for recovery: therapeutic/behavioral models, for business: consulting frameworks, for tech: step-by-step breakdowns).
5. Output SECTIONS including, but not limited to: [Situation/Context], [Objective], [Key Strategies], [Detailed Plan/Steps], [Critical Guidance], [Examples], [Prompt Quality Checklist]—but ADAPT these for the topic/domain.
6. Respond ONLY with the final expert-level, context-aware super prompt.
7. Do NOT include meta-commentary, generic prompt engineering language, or raw user input—make it detailed, actionable, and expertly tailored.

LAZY PROMPT:
${lazyPrompt}

USER CONTEXT:
Purpose: ${purpose}
Target Model: ${modelId}

OUTPUT FORMAT:
- Bold or clearly headed sections
- Lists, checkboxes, and plans as relevant to topic
- Comprehensive, actionable instructions
- Use vocabulary and knowledge frameworks from the relevant domain
- Adapt headings, checklist, and guidance to match the user's real goal

Your super prompt should FAR EXCEED competitors by its clarity, domain expertise, and depth of guidance.
    `.trim();

    // Increased output token limit for extra detail.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancementPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Increased for longer outputs
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!enhancedPrompt) {
      throw new Error('No enhanced prompt generated');
    }

    console.log(`✅ [Advanced] Enhanced prompt generated for ${modelId} using ${geminiModel}`);

    return new Response(JSON.stringify({ enhancedPrompt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-enhance function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
