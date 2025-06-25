
export const getModelSpecificOptimization = (modelId: string, purpose: string): string => {
  const optimizations: Record<string, Record<string, string>> = {
    chatgpt: {
      standard: "Structure your response with clear sections and step-by-step thinking. Use numbered lists and bullet points. Be comprehensive yet concise. Think through each aspect methodically.",
      reasoning: "Break down complex problems into smaller components. Show your reasoning process explicitly. Consider multiple perspectives and potential counterarguments before reaching conclusions.",
      research: "Provide thorough analysis with credible sources and examples. Structure with clear headings, subheadings, and bullet points. Include relevant statistics and case studies where applicable.",
      brainstorming: "Generate multiple creative and innovative ideas. Think outside conventional boundaries. Provide both practical and ambitious solutions. Consider implementation feasibility.",
      drafting: "Create well-structured content with engaging introductions, detailed body sections, and strong conclusions. Use active voice and varied sentence structures.",
      code: "Write clean, well-commented code with proper error handling. Follow best practices and include explanations for complex logic. Provide usage examples and documentation."
    },
    claude: {
      standard: "Provide thoughtful, nuanced responses with clear ethical considerations. Consider multiple viewpoints and acknowledge complexity. Be thorough in your analysis.",
      reasoning: "Engage in careful step-by-step analysis. Consider edge cases, counterarguments, and ethical implications. Provide balanced, well-reasoned conclusions.",
      research: "Conduct comprehensive research with detailed citations and context. Analyze information critically and present findings with appropriate caveats and limitations.",
      brainstorming: "Explore creative possibilities while maintaining ethical considerations. Think systematically about implementation challenges and societal impact.",
      drafting: "Create eloquent, well-reasoned content with sophisticated language. Maintain clear structure while incorporating nuanced perspectives and ethical considerations.",
      code: "Write elegant, maintainable code with thorough documentation. Consider security implications, scalability, and ethical use cases in your implementation."
    },
    grok: {
      standard: "Be direct, informative, and conversational. Cut through complexity with clear explanations. Provide practical insights with real-world applications.",
      reasoning: "Use straightforward logic and clear evidence. Avoid overcomplication while maintaining thorough analysis. Focus on actionable conclusions.",
      research: "Deliver comprehensive information in accessible formats. Use clear examples and practical applications. Focus on actionable insights and key takeaways.",
      brainstorming: "Generate bold, innovative ideas with practical grounding. Think unconventionally while remaining realistic about implementation challenges.",
      drafting: "Create engaging content with personality and conversational tone. Balance professionalism with accessibility and human connection.",
      code: "Write robust, practical code focused on functionality and performance. Include clear comments and practical examples. Prioritize working solutions."
    },
    gemini: {
      standard: "Provide comprehensive responses that can integrate multiple information types. Use structured organization with clear visual hierarchy when possible.",
      reasoning: "Apply logical analysis across different information sources and formats. Consider visual, textual, and contextual elements in your reasoning.",
      research: "Integrate information from diverse sources and formats. Provide well-organized findings with multimodal considerations where relevant.",
      brainstorming: "Generate diverse, creative solutions considering multiple approaches and formats. Think about multimedia applications and innovative frameworks.",
      drafting: "Create rich, engaging content that leverages multiple information types. Structure content for clarity while considering visual and interactive elements.",
      code: "Write versatile code that handles multiple input types effectively. Include comprehensive testing, documentation, and consider multimodal applications."
    }
  };

  return optimizations[modelId]?.[purpose] || optimizations[modelId]?.standard || "Provide a comprehensive and well-structured response.";
};

export const getModelName = (modelId: string): string => {
  const modelNames: Record<string, string> = {
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    grok: 'Grok',
    gemini: 'Gemini'
  };
  return modelNames[modelId] || modelId;
};
