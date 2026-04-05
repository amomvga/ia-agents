import { RagSearchHit } from './rag.types';

export const buildRagAnswerPrompt = ({
  question,
  hits,
}: {
  question: string;
  hits: RagSearchHit[];
}) => {
  const contextBlock = hits
    .map(
      (hit) =>
        `CHUNK_ID: ${hit.chunk.id}
TITLE: ${hit.chunk.documentTitle}
SOURCE: ${hit.chunk.source}
CONTENT:
${hit.chunk.content}`,
    )
    .join('\n\n');

  return `
Responda à pergunta usando apenas os trechos recuperados abaixo.

Trechos:
${contextBlock}

Retorne somente JSON válido com answer, usedChunkIds e confidence.

Pergunta:
${question}
`.trim();
};
