export const buildToolSelectionPrompt = (message: string) =>
  `
Analise a solicitação do usuário e escolha a ferramenta mais adequada.

Ferramentas disponíveis:
- answer_technical_question: use para perguntas técnicas
- summarize_content: use para pedidos de resumo
- generate_study_plan: use para pedidos de plano de estudo

Retorne somente JSON válido com toolName, confidence e reason.

Solicitação do usuário:
${message}
`.trim();
