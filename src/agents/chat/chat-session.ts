import { ChatSession, ChatMessage } from './chat.types';

const sessions = new Map<string, ChatSession>();

export const createChatSession = (sessionId: string): ChatSession => {
  const session: ChatSession = { sessionId, messages: [] };
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
  return session;
};
