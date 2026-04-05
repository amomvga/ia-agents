import { ChatMessage, ChatSession } from './chat.types';

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

export const buildRetrievedContext = ({
  session,
  recentLimit,
}: {
  session: ChatSession;
  recentLimit: number;
}) => {
  const recentMessages = getRecentMessages({ messages: session.messages, limit: recentLimit });
  const summaryBlock = session.memory.summary || 'Nenhum resumo disponível';
  const topicsBlock =
    session.memory.lastTopics.length > 0
      ? session.memory.lastTopics.join(', ')
      : 'Nenhum tópico registrado';
  const recentBlock = formatMessagesForPrompt(recentMessages);

  return `
Resumo persistido da sessão:
${summaryBlock}

Tópicos recentes:
${topicsBlock}

Histórico recente:
${recentBlock || 'Nenhuma mensagem recente'}
`.trim();
};
