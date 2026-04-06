import { Router } from 'express';
import { playground } from '../controllers/playground.controller';
import { classifier } from '../controllers/classifier.controller';
import { router } from '../controllers/router.controller';
import { runTechnicalAssistant, runTechnicalAssistantBatch } from '../controllers/technical-assistant.controller';
import { chat, chatBatch, persistentChat, sessionMemoryView } from '../controllers/chat.controller';
import { executeTool, executeToolWithAudit } from '../controllers/tool-executor.controller';
import { reliableTechnicalAssistant } from '../controllers/reliability.controller';
import { ragQuestion } from '../controllers/rag.controller';
import { generateCode, reviewCode, refactorCode, generateAndReview, codeAssistant } from '../controllers/code.controller';

const agentRouter = Router();

agentRouter.post('/playground', playground);

agentRouter.post('/classifier', classifier);

agentRouter.post('/router', router);

agentRouter.post('/runTechnicalAssistant', runTechnicalAssistant);
agentRouter.post('/runTechnicalAssistantBatch', runTechnicalAssistantBatch);

agentRouter.post('/chat', chat);
agentRouter.post('/chat/batch', chatBatch);
agentRouter.post('/chat/persistent', persistentChat);
agentRouter.get('/chat/session/:sessionId/memory', sessionMemoryView);

agentRouter.post('/tools/execute', executeTool);
agentRouter.post('/tools/execute/audit', executeToolWithAudit);

agentRouter.post('/reliability/technical-assistant', reliableTechnicalAssistant);

agentRouter.post('/rag/question', ragQuestion);

agentRouter.post('/code/generate', generateCode);
agentRouter.post('/code/review', reviewCode);
agentRouter.post('/code/refactor', refactorCode);
agentRouter.post('/code/generate-and-review', generateAndReview);
agentRouter.post('/code/assistant', codeAssistant);

export default agentRouter;
