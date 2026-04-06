import { Request, Response } from 'express';
import {
  generateCodeDraft,
  reviewCodeDraft,
  refactorCodeDraft,
  runGenerateAndReviewPipeline,
  runCodeAssistant,
} from '../agents/code/code.agent';
import { RunCodeAssistantInput } from '../agents/code/code.types';

export const generateCode = async (req: Request, res: Response) => {
  const { task, language, runtime, context } = req.body;

  if (!task?.trim()) {
    res.status(400).json({ message: 'O campo task precisa ser informado.' });
    return;
  }

  if (!language || !['ts', 'js'].includes(language)) {
    res.status(400).json({ message: 'O campo language deve ser "ts" ou "js".' });
    return;
  }

  const result = await generateCodeDraft({ task, language, runtime: runtime ?? 'node', context });

  res.status(200).json(result);
};

export const reviewCode = async (req: Request, res: Response) => {
  const { code, language, objective } = req.body;

  if (!code?.trim()) {
    res.status(400).json({ message: 'O campo code precisa ser informado.' });
    return;
  }

  if (!language || !['ts', 'js'].includes(language)) {
    res.status(400).json({ message: 'O campo language deve ser "ts" ou "js".' });
    return;
  }

  const result = await reviewCodeDraft({ code, language, objective });

  res.status(200).json(result);
};

export const refactorCode = async (req: Request, res: Response) => {
  const { code, language, goal } = req.body;

  if (!code?.trim()) {
    res.status(400).json({ message: 'O campo code precisa ser informado.' });
    return;
  }

  if (!language || !['ts', 'js'].includes(language)) {
    res.status(400).json({ message: 'O campo language deve ser "ts" ou "js".' });
    return;
  }

  if (!goal?.trim()) {
    res.status(400).json({ message: 'O campo goal precisa ser informado.' });
    return;
  }

  const result = await refactorCodeDraft({ code, language, goal });

  res.status(200).json(result);
};

export const generateAndReview = async (req: Request, res: Response) => {
  const { task, language, runtime, context } = req.body;

  if (!task?.trim()) {
    res.status(400).json({ message: 'O campo task precisa ser informado.' });
    return;
  }

  if (!language || !['ts', 'js'].includes(language)) {
    res.status(400).json({ message: 'O campo language deve ser "ts" ou "js".' });
    return;
  }

  const result = await runGenerateAndReviewPipeline({ task, language, runtime: runtime ?? 'node', context });

  res.status(200).json(result);
};

export const codeAssistant = async (req: Request, res: Response) => {
  const input: RunCodeAssistantInput = req.body;

  if (!input.mode || !['generate', 'review', 'refactor'].includes(input.mode)) {
    res.status(400).json({ message: 'O campo mode deve ser "generate", "review" ou "refactor".' });
    return;
  }

  if (!input.payload) {
    res.status(400).json({ message: 'O campo payload precisa ser informado.' });
    return;
  }

  const result = await runCodeAssistant(input);

  res.status(200).json(result);
};
