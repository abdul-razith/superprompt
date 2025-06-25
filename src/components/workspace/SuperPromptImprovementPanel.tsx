
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuperPromptImprovementPanelProps {
  questions: string[];
  onSubmit: (answers: string[]) => void;
  isSubmitting: boolean;
}

export const SuperPromptImprovementPanel: React.FC<SuperPromptImprovementPanelProps> = ({
  questions,
  onSubmit,
  isSubmitting
}) => {
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(""));

  const handleChange = (idx: number, value: string) => {
    setAnswers(prev =>
      prev.map((prevVal, i) => (i === idx ? value : prevVal))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <Card className="mt-6 shadow-lg border-blue-300">
      <CardHeader>
        <CardTitle className="text-md">Improve Your Super Prompt</CardTitle>
        <p className="text-xs text-gray-600 mt-1">
          Answer the following questions to generate an even more advanced, personalized super prompt.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {questions.map((q, idx) => (
            <div key={idx}>
              <label className="text-sm font-medium">{idx + 1}. {q}</label>
              <textarea
                className="w-full border rounded p-2 mt-1 min-h-[40px] text-sm"
                value={answers[idx]}
                onChange={e => handleChange(idx, e.target.value)}
                placeholder="Type your answer..."
                required
              />
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enhancing..." : "Generate Advanced Superprompt"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
