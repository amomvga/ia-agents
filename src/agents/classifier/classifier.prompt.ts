export const buildClassificationPrompt = (message: string) =>
  `
Classifique a mensagem do usuário em uma das categorias:
- question
- task
- chat

Responda somente em JSON válido com o formato:
{
  "label": "question | task | chat",
  "confidence": 0.0,
  "reason": "texto curto"
}

Mensagem:
${message}
`.trim();
