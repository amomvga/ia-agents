import { Request, Response } from 'express';
import { classifyMessage } from '../agents/classifier/classifier.agent';

export const classifier = async (req: Request, res: Response) => {
  const message = String(req.body.message ?? '');

  if (!message.trim()) {
    res.status(400).json({ message: 'A mensagem precisa ser informada.' });
    return;
  }

  const result = await classifyMessage(message);

  res.status(200).json(result);
};
