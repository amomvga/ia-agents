import { generateText } from '../../core/ollama-client';
import { extractJsonObject } from '../../utils/json';
import { toolSelectionSchema, ToolSelection } from './tool-executor.schema';
import { buildToolSelectionPrompt } from './tool-executor.prompt';
import { toolRegistry } from './tool-registry';
import { ToolName, ToolAgentExecutionResult } from './tool-executor.types';

export const selectToolForMessage = async (message: string): Promise<ToolSelection> => {
  const response = await generateText({
    system: 'Você é um roteador de tools preciso e conservador.',
    prompt: buildToolSelectionPrompt(message),
  });

  const parsed = extractJsonObject(response);
  return toolSelectionSchema.parse(parsed);
};

export const executeToolForMessage = async (message: string) => {
  const selection = await selectToolForMessage(message);
  const result = await toolRegistry[selection.toolName](message);

  return { selection, result };
};

export const executeSelectedTool = async ({
  message,
  selection,
  allowedTools,
}: {
  message: string;
  selection: ToolSelection;
  allowedTools?: ToolName[];
}): Promise<ToolAgentExecutionResult> => {
  if (selection.confidence < 0.65) {
    return {
      input: message,
      executed: false,
      selection,
      clarification: 'Não houve confiança suficiente para executar uma ferramenta.',
    };
  }

  if (allowedTools && !allowedTools.includes(selection.toolName)) {
    return {
      input: message,
      executed: false,
      selection,
      clarification: 'A ferramenta selecionada não está permitida neste contexto.',
    };
  }

  const handler = toolRegistry[selection.toolName];
  const execution = await handler(message);

  return {
    input: message,
    executed: true,
    selection,
    execution,
  };
};

export const runToolAgentWithAudit = async ({ message }: { message: string }) => {
  const result = await runToolAgent({ message });

  return {
    ...result,
    audit: {
      selectedTool: result.selection.toolName,
      executed: result.executed,
      confidence: result.selection.confidence,
      blockedReason: result.executed ? undefined : result.clarification,
    },
  };
};

export const runToolAgent = async ({
  message,
  allowedTools,
}: {
  message: string;
  allowedTools?: ToolName[];
}) => {
  const selection = await selectToolForMessage(message);
  return executeSelectedTool({ message, selection, allowedTools });
};
