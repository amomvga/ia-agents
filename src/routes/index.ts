import { Router } from 'express';
import agentRouter from './agent.routes';

const routes = Router();

routes.use('/agents', agentRouter);

export default routes;
