import { generateText } from '../../core/ollama-client';
import { extractJsonObject } from '../../utils/json';
import { classificationSchema } from './classifier.schema';
import { buildClassificationPrompt } from './classifier.prompt';

export const classifyMessage = async (message: string) => {
  const response = await generateText({
    system: 'Você é um classificador técnico preciso e objetivo.',
    prompt: buildClassificationPrompt(message),
  });

  const parsed = extractJsonObject(response);
  return classificationSchema.parse(parsed);
};
