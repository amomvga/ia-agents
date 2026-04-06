export type CodeAgentMode = 'generate' | 'review' | 'refactor' | 'explain';

export type CodeGenerationInput = {
  task: string;
  language: 'ts' | 'js';
  runtime: 'node';
  context?: string;
};

export type CodeReviewInput = {
  code: string;
  language: 'ts' | 'js';
  objective?: string;
};

export type CodeRefactorInput = {
  code: string;
  language: 'ts' | 'js';
  goal: string;
};

export type RunCodeAssistantInput =
  | { mode: 'generate'; payload: CodeGenerationInput }
  | { mode: 'review'; payload: CodeReviewInput }
  | { mode: 'refactor'; payload: CodeRefactorInput };
