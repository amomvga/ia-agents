import { generateText } from '../../core/ollama-client';

export const generateStudyPlan = async (input: string): Promise<string> => {
  return generateText({
    system: 'Você é um instrutor técnico que cria planos de estudo práticos.',
    prompt: `Crie um plano de estudo objetivo para o tema abaixo.

Tema:
${input}`,
  });
};
