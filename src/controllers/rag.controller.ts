import { Request, Response } from 'express';
import { runRagQuestion } from '../agents/rag/rag.agent';
import { ragSampleDocuments } from '../agents/rag/rag.fixtures';
import { RagDocument } from '../agents/rag/rag.types';

export const ragQuestion = async (req: Request, res: Response) => {
  const question = String(req.body.question ?? '');
  const documents: RagDocument[] = req.body.documents ?? ragSampleDocuments;
  const maxWordsPerChunk = Number(req.body.maxWordsPerChunk ?? 100);
  const topK = Number(req.body.topK ?? 3);

  if (!question.trim()) {
    res.status(400).json({ message: 'A pergunta precisa ser informada.' });
    return;
  }

  const result = await runRagQuestion({
    documents,
    question,
    maxWordsPerChunk,
    topK,
  });

  res.status(200).json(result);
};
