
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  prompt: string;
  userTier: 'free' | 'premium';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userTier }: AnalyzeRequest = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log(`Analyzing prompt for ${userTier} user`);

    const analysisPrompt = `Analyze this prompt and provide a JSON response with the following structure:
{
  "complexity": "simple" | "moderate" | "complex",
  "suggestedModels": ["list of recommended AI models"],
  "estimatedTokens": number,
  "sentiment": "positive" | "neutral" | "negative",
  "suggestions": ["list of optimization suggestions"]
}

Consider these factors:
- Word count and sentence structure
- Technical complexity and domain expertise required
- Multiple tasks or questions
- Clarity and specificity level

PROMPT TO ANALYZE: "${prompt}"

Respond with ONLY the JSON object, no other text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 512,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse JSON response
    const analysis = JSON.parse(analysisText.trim());
    
    // Add AI confidence score
    analysis.aiConfidence = 0.95;

    console.log('✅ AI-powered prompt analysis completed');

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-analyze function:', error);
    
    // Return fallback analysis
    const fallbackAnalysis = {
      complexity: 'moderate',
      suggestedModels: ['chatgpt', 'claude'],
      estimatedTokens: prompt.split(/\s+/).length * 1.3,
      sentiment: 'neutral',
      suggestions: ['Add more context and specific details'],
      aiConfidence: 0.7,
      fallback: true
    };

    return new Response(JSON.stringify(fallbackAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
