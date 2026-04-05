export type SuccessResult<T> = {
  success: true;
  data: T;
};

export type FailureResult = {
  success: false;
  error: string;
  stage: 'input' | 'generation' | 'parsing' | 'validation' | 'fallback';
};

export type OperationResult<T> = SuccessResult<T> | FailureResult;

export type ReliabilityAudit = {
  attempts: number;
  usedFallback: boolean;
  finalStage: 'primary' | 'retry' | 'fallback' | 'input-error';
};

export type ReliableAssistantResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  stage?: 'input' | 'generation' | 'parsing' | 'validation' | 'fallback';
  attempts: number;
  usedFallback: boolean;
};
