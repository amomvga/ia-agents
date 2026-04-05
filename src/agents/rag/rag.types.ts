export type RagDocument = {
  id: string;
  title: string;
  content: string;
  source: string;
};

export type RagChunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  source: string;
  content: string;
  index: number;
};

export type RagChunkEmbedding = {
  chunk: RagChunk;
  embedding: number[];
};

export type RagSearchHit = {
  chunk: RagChunk;
  score: number;
};
