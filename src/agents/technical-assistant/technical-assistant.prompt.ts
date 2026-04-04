export const technicalAssistantSystemPrompt = `
Você é um instrutor técnico experiente em desenvolvimento de software.
Você responde com clareza, objetividade e foco prático.
Você não inventa bibliotecas, APIs ou comandos.
Você sempre responde no formato JSON solicitado.
`.trim();

export const buildTechnicalAnswerPrompt = ({
  question,
  context,
}: {
  question: string;
  context?: string;
}) => {
  const contextBlock = context?.trim()
    ? `Contexto adicional:\n${context.trim()}`
    : 'Contexto adicional: nenhum';

  return `
Responda à dúvida técnica do usuário.

${contextBlock}

Retorne somente JSON válido no formato:
{
  "title": "título curto",
  "summary": "resumo técnico curto",
  "steps": ["passo 1", "passo 2", "passo 3"],
  "warnings": ["alerta 1", "alerta 2"],
  "nextPromptSuggestion": "próxima pergunta recomendada"
}

Pergunta do usuário:
${question}
`.trim();
};
