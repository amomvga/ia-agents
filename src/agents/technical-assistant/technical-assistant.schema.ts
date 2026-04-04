import { z } from 'zod';

export const technicalAnswerSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  steps: z.array(z.string().min(3)).min(3).max(6),
  warnings: z.array(z.string().min(2)).max(5),
  nextPromptSuggestion: z.string().min(5),
});

export type TechnicalAnswerResult = z.infer<typeof technicalAnswerSchema>;
