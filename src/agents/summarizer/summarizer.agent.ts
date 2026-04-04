import { generateText } from '../../core/ollama-client';

export const generateSummary = async (input: string): Promise<string> => {
  return generateText({
    system: 'Você é um resumidor técnico claro e objetivo.',
    prompt: `Resuma o conteúdo abaixo em até 5 linhas.

Conteúdo:
${input}`,
  });
};
