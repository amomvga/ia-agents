import { z } from 'zod';

export const classificationSchema = z.object({
  label: z.enum(['question', 'task', 'chat']),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(1),
});

export type Classification = z.infer<typeof classificationSchema>;
