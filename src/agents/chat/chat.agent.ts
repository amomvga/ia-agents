import { generateText } from '../../core/ollama-client';
import { appendMessageToSession, getOrCreateChatSession, updateSessionMemory } from './chat-session';
import { getRecentMessages, formatMessagesForPrompt, buildRetrievedContext } from './chat-utils';
import { loadPersistedSessions, savePersistedSessions } from './chat-storage';
import { ChatSession } from './chat.types';
import { chatSystemPrompt, buildChatPrompt, memorySummarySystemPrompt, buildSessionSummaryPrompt } from './chat.prompt';
import { parseStructuredResponse } from '../reliability/reliability.agent';
import { chatMemorySchema } from './chat.schema';
import { ChatMessage, ChatSessionMemory } from './chat.types';

export const buildSessionMemory = async ({
  previousMemory,
  recentMessages,
}: {
  previousMemory: ChatSessionMemory;
  recentMessages: ChatMessage[];
}) => {
  const response = await generateText({
    system: memorySummarySystemPrompt,
    prompt: buildSessionSummaryPrompt({
      previousSummary: previousMemory.summary,
      recentMessages: formatMessagesForPrompt(recentMessages),
    }),
  });

  const parsed = parseStructuredResponse(response, chatMemorySchema);

  if (!parsed.success) {
    return {
      summary: previousMemory.summary || 'Resumo indisponível nesta execução.',
      lastTopics: previousMemory.lastTopics.length > 0 ? previousMemory.lastTopics : ['conversation'],
    };
  }

  return parsed.data;
};

export const sendChatMessage = async ({
  sessionId,
  message,
}: {
  sessionId: string;
  message: string;
}) => {
  appendMessageToSession(sessionId, { role: 'user', content: message });

  const session = getOrCreateChatSession(sessionId);
  const retrievedContext = buildRetrievedContext({ session, recentLimit: 6 });

  const response = await generateText({
    system: chatSystemPrompt,
    prompt: buildChatPrompt({ retrievedContext, userMessage: message }),
  });

  appendMessageToSession(sessionId, { role: 'assistant', content: response });

  return { sessionId, response };
};

export const sendPersistentChatMessage = async ({
  sessionId,
  message,
}: {
  sessionId: string;
  message: string;
}) => {
  const now = new Date().toISOString();
  const allSessions = await loadPersistedSessions();

  let session: ChatSession = allSessions.find((s) => s.sessionId === sessionId) ?? {
    sessionId,
    messages: [],
    memory: { summary: '', lastTopics: [] },
    createdAt: now,
    updatedAt: now,
  };

  session.messages.push({ role: 'user', content: message, createdAt: now });
  session.updatedAt = now;

  const retrievedContext = buildRetrievedContext({ session, recentLimit: 6 });

  const response = await generateText({
    system: chatSystemPrompt,
    prompt: buildChatPrompt({ retrievedContext, userMessage: message }),
  });

  session.messages.push({ role: 'assistant', content: response, createdAt: new Date().toISOString() });

  const memory = await buildSessionMemory({
    previousMemory: session.memory,
    recentMessages: getRecentMessages({ messages: session.messages, limit: 6 }),
  });

  session.memory = memory;
  session.updatedAt = new Date().toISOString();

  const updatedSessions = [
    ...allSessions.filter((s) => s.sessionId !== sessionId),
    session,
  ];

  await savePersistedSessions(updatedSessions);

  return { sessionId, response, memory };
};

export const getSessionMemoryView = (sessionId: string) => {
  const session = getOrCreateChatSession(sessionId);

  return {
    sessionId: session.sessionId,
    summary: session.memory.summary,
    lastTopics: session.memory.lastTopics,
    totalMessages: session.messages.length,
  };
};

export const sendChatMessageBatch = async (sessionId: string, messages: string[]) => {
  const responses: string[] = [];

  for (const message of messages) {
    const result = await sendChatMessage({ sessionId, message });
    responses.push(result.response);
  }

  return responses;
};
