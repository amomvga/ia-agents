import { Request, Response } from 'express';
import { playgroundAgent } from '../agents/playground/playground.agent';

export const playground = async (req: Request, res: Response) => {
  const prompt = String(req.body.prompt ?? '');
  const system = req.body.system ? String(req.body.system) : undefined;

  if (prompt.length < 5) {
    res.status(400).json({ message: 'O prompt deve conter ao menos 5 caracteres.' });
    return;
  }

  const result = await playgroundAgent(prompt, system);

  res.status(200).json(result);
};
