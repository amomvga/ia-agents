import { RagDocument, RagChunk } from './rag.types';

export const cosineSimilarity = (a: number[], b: number[]): number => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const chunkDocument = ({
  document,
  maxWordsPerChunk,
}: {
  document: RagDocument;
  maxWordsPerChunk: number;
}): RagChunk[] => {
  const paragraphs = document.content
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  const rawChunks = paragraphs.flatMap((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);

    if (words.length <= maxWordsPerChunk) {
      return [paragraph];
    }

    const chunks: string[] = [];

    for (let index = 0; index < words.length; index += maxWordsPerChunk) {
      chunks.push(words.slice(index, index + maxWordsPerChunk).join(' '));
    }

    return chunks;
  });

  return rawChunks.map((content, index) => ({
    id: `${document.id}-chunk-${index + 1}`,
    documentId: document.id,
    documentTitle: document.title,
    source: document.source,
    content,
    index,
  }));
};
