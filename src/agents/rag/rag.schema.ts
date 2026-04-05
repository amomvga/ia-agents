import { z } from 'zod';

export const ragAnswerSchema = z.object({
  answer: z.string().min(10),
  usedChunkIds: z.array(z.string().min(1)).min(1),
  confidence: z.number().min(0).max(1),
});

export type RagAnswer = z.infer<typeof ragAnswerSchema>;
