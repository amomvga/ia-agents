import { Ollama } from 'ollama';

const ollama = new Ollama({ host: process.env.OLLAMA_BASE_URL });

type GenerateTextParams = {
  prompt: string;
  system?: string;
};

const model = process.env.OLLAMA_MODEL;
const embeddingModel = process.env.OLLAMA_EMBEDDING_MODEL;

if (!model) {
  throw new Error('A variavel de ambiente OLLAMA_MODEL e obrigatoria.');
}

if (!embeddingModel) {
  throw new Error('A variavel de ambiente OLLAMA_EMBEDDING_MODEL e obrigatoria.');
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

export const generateEmbedding = async (input: string): Promise<number[]> => {
  const response = await ollama.embed({
    model: embeddingModel,
    input,
    keep_alive: '5m',
    truncate: true,
  });

  return response.embeddings[0];
};

export const generateEmbeddings = async (inputs: string[]): Promise<number[][]> => {
  const response = await ollama.embed({
    model: embeddingModel,
    input: inputs,
    keep_alive: '5m',
    truncate: true,
  });

  return response.embeddings;
};
