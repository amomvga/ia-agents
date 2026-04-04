import './libs/env';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectDatabase } from './libs/sequelize';
import logger from './libs/logger';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

const port = process.env.PORT;

const start = async () => {
  await connectDatabase();

  app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
};

start().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`Erro ao iniciar o servidor: ${errorMessage}`);
  process.exit(1);
});
