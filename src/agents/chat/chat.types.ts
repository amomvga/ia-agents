export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSession = {
  sessionId: string;
  messages: ChatMessage[];
};
