import { ToolName, ToolExecutionResult } from './tool-executor.types';
import { generateTechnicalAnswer } from '../technical-assistant/technical-assistant.agent';
import { generateSummary } from '../summarizer/summarizer.agent';
import { generateStudyPlan } from '../study-plan/study-plan.agent';

const answerTechnicalQuestion = async (input: string): Promise<string> => {
  const result = await generateTechnicalAnswer({ question: input });
  return [result.title, '', result.summary, '', ...result.steps].join('\n');
};

export const toolRegistry: Record<ToolName, (input: string) => Promise<ToolExecutionResult>> = {
  answer_technical_question: async (input) => ({
    toolName: 'answer_technical_question',
    success: true,
    output: await answerTechnicalQuestion(input),
  }),
  summarize_content: async (input) => ({
    toolName: 'summarize_content',
    success: true,
    output: await generateSummary(input),
  }),
  generate_study_plan: async (input) => ({
    toolName: 'generate_study_plan',
    success: true,
    output: await generateStudyPlan(input),
  }),
};
