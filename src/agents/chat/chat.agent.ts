import { generateText } from '../../core/ollama-client';
import { appendMessageToSession, getOrCreateChatSession } from './chat-session';
import { getRecentMessages, formatMessagesForPrompt } from './chat-utils';
import { chatSystemPrompt, buildChatPrompt } from './chat.prompt';

export const sendChatMessage = async ({
  sessionId,
  message,
}: {
  sessionId: string;
  message: string;
}) => {
  appendMessageToSession(sessionId, { role: 'user', content: message });

  const allMessages = getOrCreateChatSession(sessionId).messages;
  const recentMessages = getRecentMessages({ messages: allMessages, limit: 6 });
  const historyBlock = formatMessagesForPrompt(recentMessages);

  const response = await generateText({
    system: chatSystemPrompt,
    prompt: buildChatPrompt({ historyBlock, userMessage: message }),
  });

  appendMessageToSession(sessionId, { role: 'assistant', content: response });

  return { sessionId, response };
};

export const sendChatMessageBatch = async (sessionId: string, messages: string[]) => {
  const responses: string[] = [];

  for (const message of messages) {
    const result = await sendChatMessage({ sessionId, message });
    responses.push(result.response);
  }

  return responses;
};
