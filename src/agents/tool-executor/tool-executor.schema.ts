import { z } from 'zod';

export const toolSelectionSchema = z.object({
  toolName: z.enum(['answer_technical_question', 'summarize_content', 'generate_study_plan']),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(3),
});

export type ToolSelection = z.infer<typeof toolSelectionSchema>;
