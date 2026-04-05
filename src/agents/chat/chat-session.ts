import { ChatMessage, ChatSession, ChatSessionMemory } from './chat.types';

const sessions = new Map<string, ChatSession>();

export const createChatSession = (sessionId: string): ChatSession => {
  const now = new Date().toISOString();
  const session: ChatSession = {
    sessionId,
    messages: [],
    memory: { summary: '', lastTopics: [] },
    createdAt: now,
    updatedAt: now,
  };
  sessions.set(sessionId, session);
  return session;
};

export const getOrCreateChatSession = (sessionId: string): ChatSession => {
  return sessions.get(sessionId) ?? createChatSession(sessionId);
};

export const appendMessageToSession = (
  sessionId: string,
  message: Omit<ChatMessage, 'createdAt'>,
): ChatSession => {
  const session = getOrCreateChatSession(sessionId);
  session.messages.push({ ...message, createdAt: new Date().toISOString() });
  session.updatedAt = new Date().toISOString();
  return session;
};

export const updateSessionMemory = (sessionId: string, memory: ChatSessionMemory): ChatSession => {
  const session = getOrCreateChatSession(sessionId);
  session.memory = memory;
  session.updatedAt = new Date().toISOString();
  return session;
};
