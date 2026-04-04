import { generateText } from '../../core/ollama-client';

export const playgroundAgent = async (prompt: string, system?: string) => {
  const content = await generateText({
    system: system ?? 'Você é um assistente técnico objetivo.',
    prompt,
  });

  return {
    content,
    model: 'ollama',
  };
};
