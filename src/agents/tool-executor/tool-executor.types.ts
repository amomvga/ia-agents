export type ToolName =
  | 'answer_technical_question'
  | 'summarize_content'
  | 'generate_study_plan';

export type ToolExecutionResult = {
  toolName: ToolName;
  success: boolean;
  output: string;
};

export type ToolDefinition = {
  name: ToolName;
  title: string;
  description: string;
};

export type ToolAgentExecutionResult = {
  input: string;
  executed: boolean;
  selection: {
    toolName: ToolName;
    confidence: number;
    reason: string;
  };
  execution?: ToolExecutionResult;
  clarification?: string;
};
