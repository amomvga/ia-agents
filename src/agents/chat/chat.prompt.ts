export const chatSystemPrompt = `
Você é um assistente técnico conversacional.
Você responde de forma clara, direta e útil.
Você mantém continuidade com base no histórico recente.
Você não inventa contexto ausente.
`.trim();

export const memorySummarySystemPrompt = `
Você resume conversas técnicas de forma objetiva.
Você responde somente em JSON válido.
Você preserva temas recentes úteis para continuidade.
`.trim();

export const buildSessionSummaryPrompt = ({
  previousSummary,
  recentMessages,
}: {
  previousSummary: string;
  recentMessages: string;
}) =>
  `
Atualize a memória resumida da conversa.

Resumo anterior:
${previousSummary || 'Nenhum resumo anterior'}

Mensagens recentes:
${recentMessages}

Retorne somente JSON válido com:
{
  "summary": "resumo atualizado da conversa",
  "lastTopics": ["tema-1", "tema-2", "tema-3"]
}
`.trim();

export const buildChatPrompt = ({
  retrievedContext,
  userMessage,
}: {
  retrievedContext: string;
  userMessage: string;
}) =>
  `
${retrievedContext}

Mensagem atual do usuário:
${userMessage}

Responda de forma conversacional, clara e objetiva.
`.trim();
