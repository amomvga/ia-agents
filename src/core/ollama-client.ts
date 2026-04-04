import { Ollama } from 'ollama';

const ollama = new Ollama({ host: process.env.OLLAMA_BASE_URL });

type GenerateTextParams = {
  prompt: string;
  system?: string;
};

const model = process.env.OLLAMA_MODEL;

if (!model) {
  throw new Error('A variavel de ambiente OLLAMA_MODEL e obrigatoria.');
}

export const generateText = async ({ prompt, system }: GenerateTextParams) => {
  const response = await ollama.generate({
    model,
    prompt,
    system,
    stream: false,
  });

  return response.response.trim();
};
