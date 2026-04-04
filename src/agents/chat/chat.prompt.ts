export const chatSystemPrompt = `
Você é um assistente técnico conversacional.
Você responde de forma clara, direta e útil.
Você mantém continuidade com base no histórico recente.
Você não inventa contexto ausente.
`.trim();

export const buildChatPrompt = ({
  historyBlock,
  userMessage,
}: {
  historyBlock: string;
  userMessage: string;
}) =>
  `
Histórico recente da conversa:
${historyBlock || 'Nenhum histórico anterior'}

Mensagem atual do usuário:
${userMessage}

Responda de forma conversacional, clara e objetiva.
`.trim();
