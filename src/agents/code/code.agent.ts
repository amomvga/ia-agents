import { generateText } from '../../core/ollama-client';
import { parseStructuredResponse } from '../reliability/reliability.agent';
import {
  codeGenerationSchema,
  CodeGenerationResult,
  codeReviewSchema,
  CodeReviewResult,
  codeRefactorSchema,
  CodeRefactorResult,
} from './code.schema';
import {
  buildCodeGenerationPrompt,
  buildCodeReviewPrompt,
  buildCodeRefactorPrompt,
} from './code.prompt';
import { CodeGenerationInput, CodeReviewInput, CodeRefactorInput, RunCodeAssistantInput } from './code.types';

const CODE_SYSTEM_PROMPT = 'Você é um engenheiro de software sênior. Responda somente com JSON válido.';

export const generateCodeDraft = async (input: CodeGenerationInput): Promise<CodeGenerationResult> => {
  const response = await generateText({
    system: CODE_SYSTEM_PROMPT,
    prompt: buildCodeGenerationPrompt(input),
  });

  const parsed = parseStructuredResponse(response, codeGenerationSchema);

  if (!parsed.success) {
    throw new Error(`Falha ao gerar código: ${parsed.error}`);
  }

  return parsed.data;
};

export const reviewCodeDraft = async (input: CodeReviewInput): Promise<CodeReviewResult> => {
  const response = await generateText({
    system: CODE_SYSTEM_PROMPT,
    prompt: buildCodeReviewPrompt(input),
  });

  const parsed = parseStructuredResponse(response, codeReviewSchema);

  if (!parsed.success) {
    throw new Error(`Falha ao revisar código: ${parsed.error}`);
  }

  return parsed.data;
};

export const refactorCodeDraft = async (input: CodeRefactorInput): Promise<CodeRefactorResult> => {
  const response = await generateText({
    system: CODE_SYSTEM_PROMPT,
    prompt: buildCodeRefactorPrompt(input),
  });

  const parsed = parseStructuredResponse(response, codeRefactorSchema);

  if (!parsed.success) {
    throw new Error(`Falha ao refatorar código: ${parsed.error}`);
  }

  return parsed.data;
};

export const runGenerateAndReviewPipeline = async (input: CodeGenerationInput) => {
  const generation = await generateCodeDraft(input);
  const review = await reviewCodeDraft({
    code: generation.code,
    language: input.language,
    objective: 'Avaliar robustez, clareza e legibilidade do código gerado',
  });

  return { generation, review };
};

export const runCodeAssistant = async (input: RunCodeAssistantInput) => {
  if (input.mode === 'generate') {
    return { mode: 'generate', result: await generateCodeDraft(input.payload) };
  }

  if (input.mode === 'review') {
    return { mode: 'review', result: await reviewCodeDraft(input.payload) };
  }

  return { mode: 'refactor', result: await refactorCodeDraft(input.payload) };
};
