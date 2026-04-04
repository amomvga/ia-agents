import { Router } from 'express';
import { playground } from '../controllers/playground.controller';
import { classifier } from '../controllers/classifier.controller';
import { router } from '../controllers/router.controller';
import { runTechnicalAssistant, runTechnicalAssistantBatch } from '../controllers/technical-assistant.controller';
import { chat, chatBatch } from '../controllers/chat.controller';
import { executeTool, executeToolWithAudit } from '../controllers/tool-executor.controller';

const agentRouter = Router();

agentRouter.post('/playground', playground);

agentRouter.post('/classifier', classifier);

agentRouter.post('/router', router);

agentRouter.post('/runTechnicalAssistant', runTechnicalAssistant);
agentRouter.post('/runTechnicalAssistantBatch', runTechnicalAssistantBatch);

agentRouter.post('/chat', chat);
agentRouter.post('/chat/batch', chatBatch);

agentRouter.post('/tools/execute', executeTool);
agentRouter.post('/tools/execute/audit', executeToolWithAudit);

export default agentRouter;
