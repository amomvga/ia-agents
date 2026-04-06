import { CodeGenerationInput, CodeReviewInput, CodeRefactorInput } from './code.types';

export const buildCodeGenerationPrompt = ({
  task,
  language,
  runtime,
  context,
}: CodeGenerationInput) =>
  `
Gere uma solução de código para a tarefa abaixo.

Linguagem: ${language}
Runtime: ${runtime}
Contexto adicional: ${context ?? 'nenhum'}

Retorne somente JSON válido com:
{
  "title": "título curto",
  "filename": "nome-do-arquivo.${language}",
  "explanation": "explicação curta",
  "code": "código completo",
  "warnings": [],
  "nextStep": "próximo passo recomendado"
}

Tarefa:
${task}
`.trim();

export const buildCodeReviewPrompt = ({ code, language, objective }: CodeReviewInput) =>
  `
Revise o código abaixo.

Linguagem: ${language}
Objetivo da revisão: ${objective ?? 'geral'}

Retorne somente JSON válido com score, positives, issues, riskLevel e nextAction.

Código:
${code}
`.trim();

export const buildCodeRefactorPrompt = ({ code, language, goal }: CodeRefactorInput) =>
  `
Refatore o código abaixo.

Linguagem: ${language}
Objetivo da refatoração:
${goal}

Retorne somente JSON válido com summary, changes, refactoredCode, riskLevel e nextAction.

Código:
${code}
`.trim();
