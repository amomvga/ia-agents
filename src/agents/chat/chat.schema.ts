import { z } from 'zod';

export const chatSessionMemorySchema = z.object({
  summary: z.string(),
  lastTopics: z.array(z.string().min(1)).max(10),
});

export const persistedSessionSchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1),
      createdAt: z.string().min(1),
    }),
  ),
  memory: chatSessionMemorySchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const persistedSessionsSchema = z.array(persistedSessionSchema);

export const chatMemorySchema = z.object({
  summary: z.string().min(3),
  lastTopics: z.array(z.string().min(1)).min(1).max(5),
});
