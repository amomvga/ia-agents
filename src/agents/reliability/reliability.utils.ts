import { ReliableAssistantResponse, ReliabilityAudit } from './reliability.types';

export const buildReliabilityAudit = (response: ReliableAssistantResponse<unknown>): ReliabilityAudit => {
  if (!response.ok) {
    return {
      attempts: response.attempts,
      usedFallback: false,
      finalStage: 'input-error',
    };
  }

  if (response.usedFallback) {
    return {
      attempts: response.attempts,
      usedFallback: true,
      finalStage: 'fallback',
    };
  }

  return {
    attempts: response.attempts,
    usedFallback: false,
    finalStage: response.attempts > 1 ? 'retry' : 'primary',
  };
};

export const tryExtractJsonObject = (value: string): unknown | null => {
  const start = value.indexOf('{');
  const end = value.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const raw = value.slice(start, end + 1);
    const sanitized = raw.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
    return JSON.parse(sanitized);
  } catch {
    return null;
  }
};
