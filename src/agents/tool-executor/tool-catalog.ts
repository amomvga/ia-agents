import { ToolDefinition } from './tool-executor.types';

export const toolCatalog: ToolDefinition[] = [
  {
    name: 'answer_technical_question',
    title: 'Responder dúvida técnica',
    description: 'Usa o agente técnico para responder perguntas sobre Node.js, TypeScript e agentes.',
  },
  {
    name: 'summarize_content',
    title: 'Resumir conteúdo',
    description: 'Recebe um texto e devolve um resumo técnico curto e claro.',
  },
  {
    name: 'generate_study_plan',
    title: 'Gerar plano de estudo',
    description: 'Gera um plano de estudo objetivo com etapas práticas.',
  },
];
