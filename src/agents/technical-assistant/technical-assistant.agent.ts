import { generateText } from '../../core/ollama-client';
import { extractJsonObject } from '../../utils/json';
import { technicalAnswerSchema, TechnicalAnswerResult } from './technical-assistant.schema';
import { technicalAssistantSystemPrompt, buildTechnicalAnswerPrompt } from './technical-assistant.prompt';

export type GenerateAnswerInput = {
  question: string;
  context?: string;
};

export const generateTechnicalAnswer = async ({
  question,
  context,
}: GenerateAnswerInput): Promise<TechnicalAnswerResult> => {
  const response = await generateText({
    system: technicalAssistantSystemPrompt,
    prompt: buildTechnicalAnswerPrompt({ question, context }),
  });

  const parsed = extractJsonObject(response);
  return technicalAnswerSchema.parse(parsed);
};
