
import { supabase } from "@/integrations/supabase/client";

export async function generateImprovementQuestions(
  lazyPrompt: string,
  superPrompt: string,
  systemPrompt?: string
): Promise<string[]> {
  const userSystemPrompt = systemPrompt ??
    "Do not make any changes until you have 95% confidence that you know what to build. Ask me follow-up questions until you have that confidence.";
  const { data, error } = await supabase.functions.invoke("generate-improvement-questions", {
    body: {
      lazyPrompt,
      superPrompt,
      systemPrompt: userSystemPrompt
    }
  });

  if (error) {
    throw new Error("Failed to generate improvement questions: " + error.message);
  }

  return data?.questions ?? [];
}
