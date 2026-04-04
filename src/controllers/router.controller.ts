import { Request, Response } from 'express';
import { classifyMessage } from '../agents/classifier/classifier.agent';
import { routeClassification, executeRouteAction } from '../agents/router/router.agent';

export const router = async (req: Request, res: Response) => {
  const message = String(req.body.message ?? '');

  if (!message.trim()) {
    res.status(400).json({ message: 'A mensagem precisa ser informada.' });
    return;
  }

  const classification = await classifyMessage(message);
  const route = routeClassification(classification);
  const execution = await executeRouteAction(route.action);

  res.status(200).json({
    input: message,
    classification,
    route,
    execution,
  });
};
