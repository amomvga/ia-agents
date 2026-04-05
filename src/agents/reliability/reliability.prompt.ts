export const buildStrictTechnicalAnswerPrompt = (question: string) =>
  `
Responda somente com JSON válido. Não escreva texto antes nem depois.
Retorne exatamente o formato esperado.
Pergunta: ${question}
`.trim();

export const buildTextFallbackAnswer = (question: string) => ({
  title: 'Resposta simplificada',
  summary: `Não foi possível gerar a estrutura completa com segurança para a pergunta: ${question}`,
  steps: [
    'Reformule a pergunta de maneira mais específica',
    'Peça um exemplo menor e mais objetivo',
    'Tente novamente com menos contexto ambíguo',
  ],
  warnings: ['A resposta foi gerada por fallback local'],
  examples: [],
  nextPromptSuggestion:
    'Explique essa mesma dúvida em formato mais simples e com um exemplo curto',
});
