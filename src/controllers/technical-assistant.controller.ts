import { Request, Response } from 'express';
import { generateTechnicalAnswer, GenerateAnswerInput } from '../agents/technical-assistant/technical-assistant.agent';

export const runTechnicalAssistant = async (req: Request, res: Response) => {
  const question = String(req.body.question ?? '');
  const context = String(req.body.context ?? '');

  if (!question.trim()) {
    res.status(400).json({ message: 'A pergunta precisa ser informada.' });
    return;
  }

  if (question.trim().length < 12) {
    res.status(400).json({ message: 'A pergunta precisa ter pelo menos 12 caracteres.' });
    return;
  }

  const result = await generateTechnicalAnswer({
    question: question.trim(),
    context: context?.trim() || undefined,
  });

  res.status(200).json(result);
};

export const runTechnicalAssistantBatch = async (req: Request, res: Response) => {
  const questions: GenerateAnswerInput[] = req.body.questions;

  const results = await Promise.all(
    questions.map((item) => {
      if (!item.question.trim()) {
        throw new Error('A pergunta precisa ser informada');
      }

      if (item.question.trim().length < 12) {
        throw new Error('A pergunta precisa ter pelo menos 12 caracteres');
      }

      return generateTechnicalAnswer({
        question: item.question.trim(),
        context: item.context?.trim() || undefined,
      });
    }),
  );

  res.status(200).json(results);
};
