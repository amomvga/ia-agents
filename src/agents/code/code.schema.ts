import { z } from 'zod';

export const codeGenerationSchema = z.object({
  title: z.string().min(3),
  filename: z.string().min(3),
  explanation: z.string().min(10),
  code: z.string().min(10),
  warnings: z.array(z.string().min(2)).max(5),
  nextStep: z.string().min(5),
});

export type CodeGenerationResult = z.infer<typeof codeGenerationSchema>;

export const codeReviewSchema = z.object({
  score: z.number().min(0).max(10),
  positives: z.array(z.string().min(3)).max(6),
  issues: z.array(z.string().min(3)).max(8),
  riskLevel: z.enum(['low', 'medium', 'high']),
  nextAction: z.string().min(5),
});

export type CodeReviewResult = z.infer<typeof codeReviewSchema>;

export const codeRefactorSchema = z.object({
  summary: z.string().min(10),
  changes: z.array(z.string().min(3)).min(1).max(8),
  refactoredCode: z.string().min(10),
  riskLevel: z.enum(['low', 'medium', 'high']),
  nextAction: z.string().min(5),
});

export type CodeRefactorResult = z.infer<typeof codeRefactorSchema>;
