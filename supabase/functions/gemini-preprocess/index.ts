import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PreprocessRequest {
  prompt: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt }: PreprocessRequest = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const preprocessPrompt = `
You are an expert prompt analyzer. Your task is to analyze the given lazy prompt and provide detailed preprocessing information.

LAZY PROMPT:
${prompt}

OUTPUT REQUIREMENTS:
1. Analyze the domain, intent, and complexity
2. Correct any grammar or spelling mistakes
3. Suggest appropriate sections for the final prompt
4. Provide visual indicators for why certain sections are recommended

Output the analysis in the following JSON format:
{
  "correctedPrompt": "grammatically correct version",
  "domain": "detected domain (e.g., software_development, content_creation, research)",
  "intent": "detected intent (e.g., instruct, explain, inform)",
  "complexity": "simple|moderate|complex",
  "suggestedSections": ["array of recommended sections based on domain"],
  "grammarCorrections": [{"original": "original text", "corrected": "corrected text"}],
  "visualIndicators": {
    "domainReason": "why this domain was detected",
    "intentReason": "why this intent was detected",
    "sectionReasons": {"section name": "why this section is recommended"}
  }
}

IMPORTANT:
- Be thorough in domain detection
- Preserve the original meaning while fixing grammar
- Suggest sections that make sense for the specific domain
- Explain your reasoning for visual indicators
`.trim();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: preprocessPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    // Parse the JSON response
    const parsedAnalysis = JSON.parse(analysis);
    console.log('✅ Prompt preprocessing completed');

    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-preprocess function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 