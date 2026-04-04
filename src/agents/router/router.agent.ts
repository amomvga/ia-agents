import { z } from 'zod';
import { classificationSchema } from '../classifier/classifier.schema';
import { RouterAction, RouteDecision } from './router.types';

export const routeClassification = (
  result: z.infer<typeof classificationSchema>,
): RouteDecision => {
  const actionMap = {
    question: 'answer_question',
    task: 'create_task',
    chat: 'reply_chat',
  } as const;

  return {
    action: actionMap[result.label],
    sourceLabel: result.label,
  };
};

export const executeRouteAction = async (action: RouterAction): Promise<string> => {
  switch (action) {
    case 'answer_question':
      return 'Executando fluxo de resposta técnica';
    case 'create_task':
      return 'Executando fluxo de criação de tarefa';
    case 'reply_chat':
      return 'Executando fluxo de conversa informal';
  }
};
