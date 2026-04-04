import { Request, Response } from 'express';
import { runToolAgent, runToolAgentWithAudit } from '../agents/tool-executor/tool-executor.agent';
import { ToolName } from '../agents/tool-executor/tool-executor.types';

export const executeTool = async (req: Request, res: Response) => {
  const message = String(req.body.message ?? '');
  const allowedTools: ToolName[] | undefined = req.body.allowedTools;

  if (!message.trim()) {
    res.status(400).json({ message: 'A mensagem precisa ser informada.' });
    return;
  }

  const result = await runToolAgent({ message, allowedTools });

  res.status(200).json(result);
};

export const executeToolWithAudit = async (req: Request, res: Response) => {
  const message = String(req.body.message ?? '');

  if (!message.trim()) {
    res.status(400).json({ message: 'A mensagem precisa ser informada.' });
    return;
  }

  const result = await runToolAgentWithAudit({ message });

  res.status(200).json(result);
};
