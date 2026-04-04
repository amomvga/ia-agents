export type RouterAction = 'answer_question' | 'create_task' | 'reply_chat';

export type RouteDecision = {
  action: RouterAction;
  sourceLabel: 'question' | 'task' | 'chat';
};
