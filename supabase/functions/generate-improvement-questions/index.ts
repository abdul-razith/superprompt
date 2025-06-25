
// Edge Function: generate-improvement-questions

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { lazyPrompt, superPrompt, systemPrompt } = body;

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not set.");
    }
    if (!lazyPrompt || !superPrompt || !systemPrompt) {
      throw new Error("Missing required parameters.");
    }

    // Compose the system and user messages
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `
A user entered this LAZY PROMPT:

${lazyPrompt}

Your system outputted this SUPER PROMPT:

${superPrompt}

Based on the actual topic/intent, generate exactly three open-ended follow-up questions that will help gather the key context needed for an even stronger and more specific instruction (advanced super prompt). Questions must be highly relevant to this particular subject or use case, as a prompt strategist would ask. Output as a JSON array.
`
      }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 256,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    let questionsText = result?.choices?.[0]?.message?.content ?? "";
    let questions: string[] = [];

    // Attempt to parse JSON array, else fallback to line splitting
    try {
      questions = JSON.parse(questionsText);
      if (!Array.isArray(questions)) {
        throw new Error("Not an array");
      }
    } catch {
      // fallback: split lines, filter for ? at end
      questions = questionsText
        .split('\n')
        .map(q => q.trim())
        .filter(Boolean)
        .filter(q => q.endsWith("?"));
      if (questions.length === 0) {
        questions = [questionsText.trim()];
      }
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
