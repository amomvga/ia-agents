import { generateEmbedding, generateEmbeddings, generateText } from '../../core/ollama-client';
import { RagChunk, RagChunkEmbedding, RagDocument, RagSearchHit } from './rag.types';
import { cosineSimilarity, chunkDocument } from './rag.utils';
import { buildRagAnswerPrompt } from './rag.prompt';
import { ragAnswerSchema, RagAnswer } from './rag.schema';
import { parseStructuredResponse } from '../reliability/reliability.agent';

export const indexChunks = async (chunks: RagChunk[]): Promise<RagChunkEmbedding[]> => {
  const embeddings = await generateEmbeddings(chunks.map((chunk) => chunk.content));
  return chunks.map((chunk, index) => ({ chunk, embedding: embeddings[index] }));
};

export const searchIndex = async ({
  index,
  query,
  topK,
}: {
  index: RagChunkEmbedding[];
  query: string;
  topK: number;
}): Promise<RagSearchHit[]> => {
  const queryEmbedding = await generateEmbedding(query);

  return index
    .map((item) => ({ chunk: item.chunk, score: cosineSimilarity(queryEmbedding, item.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};

export const generateRagAnswer = async ({
  question,
  hits,
}: {
  question: string;
  hits: RagSearchHit[];
}): Promise<RagAnswer> => {
  const response = await generateText({
    system: 'Você é um assistente técnico preciso. Responda apenas com base nos trechos fornecidos.',
    prompt: buildRagAnswerPrompt({ question, hits }),
  });

  const parsed = parseStructuredResponse(response, ragAnswerSchema);

  if (!parsed.success) {
    return {
      answer: response,
      usedChunkIds: hits.map((h) => h.chunk.id),
      confidence: 0,
    };
  }

  return parsed.data;
};

export const runRagQuestion = async ({
  documents,
  question,
  maxWordsPerChunk,
  topK,
}: {
  documents: RagDocument[];
  question: string;
  maxWordsPerChunk: number;
  topK: number;
}) => {
  const validDocuments = documents.filter((document) => document.content.trim());
  const chunks = validDocuments.flatMap((document) => chunkDocument({ document, maxWordsPerChunk }));
  const index = await indexChunks(chunks);
  const hits = await searchIndex({ index, query: question.trim(), topK });
  const answer = await generateRagAnswer({ question: question.trim(), hits });

  return {
    question: question.trim(),
    totalDocuments: validDocuments.length,
    totalChunks: chunks.length,
    hits,
    answer,
  };
};
