import { ChatMessage } from './chat.types';

export const getRecentMessages = ({
  messages,
  limit,
}: {
  messages: ChatMessage[];
  limit: number;
}) => {
  if (limit <= 0) {
    return [];
  }

  return messages.slice(-limit);
};

export const formatMessagesForPrompt = (messages: ChatMessage[]) => {
  return messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');
};
