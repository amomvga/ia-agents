import { z } from 'zod';
import { OperationResult, ReliableAssistantResponse } from './reliability.types';
import { tryExtractJsonObject } from './reliability.utils';
import { generateText } from '../../core/ollama-client';
import { technicalAnswerSchema } from '../technical-assistant/technical-assistant.schema';
import {
  technicalAssistantSystemPrompt,
  buildTechnicalAnswerPrompt,
} from '../technical-assistant/technical-assistant.prompt';
import { buildStrictTechnicalAnswerPrompt, buildTextFallbackAnswer } from './reliability.prompt';

export const parseStructuredResponse = <T>(
  response: string,
  schema: z.ZodType<T>,
): OperationResult<T> => {
  const extracted = tryExtractJsonObject(response);

  if (!extracted) {
    return {
      success: false,
      error: 'Não foi possível extrair um objeto JSON da resposta',
      stage: 'parsing',
    };
  }

  const validation = schema.safeParse(extracted);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(' | '),
      stage: 'validation',
    };
  }

  return {
    success: true,
    data: validation.data,
  };
};

export const generateReliableTechnicalAnswer = async ({
  question,
  context,
}: {
  question: string;
  context?: string;
}): Promise<OperationResult<z.infer<typeof technicalAnswerSchema>>> => {
  try {
    const firstResponse = await generateText({
      system: technicalAssistantSystemPrompt,
      prompt: buildTechnicalAnswerPrompt({ question, context }),
    });

    const firstParsed = parseStructuredResponse(firstResponse, technicalAnswerSchema);
    if (firstParsed.success) {
      return firstParsed;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha na geração da resposta principal',
      stage: 'generation',
    };
  }

  try {
    const retryResponse = await generateText({
      system: technicalAssistantSystemPrompt,
      prompt: buildStrictTechnicalAnswerPrompt(question),
    });

    const retryParsed = parseStructuredResponse(retryResponse, technicalAnswerSchema);
    if (retryParsed.success) {
      return retryParsed;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha na geração da resposta de retry',
      stage: 'generation',
    };
  }

  return {
    success: true,
    data: buildTextFallbackAnswer(question),
  };
};

export const runReliableTechnicalAssistant = async ({
  question,
  context,
}: {
  question: string;
  context?: string;
}): Promise<ReliableAssistantResponse<z.infer<typeof technicalAnswerSchema>>> => {
  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    return { ok: false, error: 'A pergunta precisa ser informada', stage: 'input', attempts: 0, usedFallback: false };
  }

  if (normalizedQuestion.length < 12) {
    return { ok: false, error: 'A pergunta precisa ter pelo menos 12 caracteres', stage: 'input', attempts: 0, usedFallback: false };
  }

  const result = await generateReliableTechnicalAnswer({ question: normalizedQuestion, context });

  if (!result.success) {
    return { ok: false, error: result.error, stage: result.stage, attempts: 2, usedFallback: false };
  }

  const usedFallback = result.data.title === 'Resposta simplificada';

  return {
    ok: true,
    data: result.data,
    attempts: usedFallback ? 2 : 1,
    usedFallback,
  };
};
