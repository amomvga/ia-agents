import { Request, Response } from 'express';
import {
  sendChatMessage,
  sendChatMessageBatch,
  sendPersistentChatMessage,
  getSessionMemoryView,
} from '../agents/chat/chat.agent';

export const chat = async (req: Request, res: Response) => {
  const sessionId = String(req.body.sessionId ?? '');
  const message = String(req.body.message ?? '');

  if (!sessionId.trim()) {
    res.status(400).json({ message: 'O sessionId precisa ser informado.' });
    return;
  }

  if (!message.trim()) {
    res.status(400).json({ message: 'A mensagem precisa ser informada.' });
    return;
  }

  const result = await sendChatMessage({ sessionId, message });

  res.status(200).json(result);
};

export const chatBatch = async (req: Request, res: Response) => {
  const sessionId = String(req.body.sessionId ?? '');
  const messages: string[] = req.body.messages;

  if (!sessionId.trim()) {
    res.status(400).json({ message: 'O sessionId precisa ser informado.' });
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ message: 'O array de mensagens precisa ser informado.' });
    return;
  }

  const responses = await sendChatMessageBatch(sessionId, messages);

  res.status(200).json({ sessionId, responses });
};

export const persistentChat = async (req: Request, res: Response) => {
  const sessionId = String(req.body.sessionId ?? '');
  const message = String(req.body.message ?? '');

  if (!sessionId.trim()) {
    res.status(400).json({ message: 'O sessionId precisa ser informado.' });
    return;
  }

  if (!message.trim()) {
    res.status(400).json({ message: 'A mensagem precisa ser informada.' });
    return;
  }

  const result = await sendPersistentChatMessage({ sessionId, message });

  res.status(200).json(result);
};

export const sessionMemoryView = (req: Request, res: Response) => {
  const sessionId = String(req.params.sessionId ?? '');

  if (!sessionId.trim()) {
    res.status(400).json({ message: 'O sessionId precisa ser informado.' });
    return;
  }

  const result = getSessionMemoryView(sessionId);

  res.status(200).json(result);
};
