export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSessionMemory = {
  summary: string;
  lastTopics: string[];
};

export type ChatSession = {
  sessionId: string;
  messages: ChatMessage[];
  memory: ChatSessionMemory;
  createdAt: string;
  updatedAt: string;
};
