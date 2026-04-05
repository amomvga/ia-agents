import { Request, Response } from 'express';
import { runReliableTechnicalAssistant } from '../agents/reliability/reliability.agent';
import { buildReliabilityAudit } from '../agents/reliability/reliability.utils';

export const reliableTechnicalAssistant = async (req: Request, res: Response) => {
  const question = String(req.body.question ?? '');
  const context = String(req.body.context ?? '');

  const result = await runReliableTechnicalAssistant({
    question,
    context: context.trim() || undefined,
  });

  if (!result.ok) {
    res.status(400).json({
      ok: false,
      error: result.error,
      stage: result.stage,
      attempts: result.attempts,
    });
    return;
  }

  const audit = buildReliabilityAudit(result);

  res.status(200).json({ ...result, audit });
};
