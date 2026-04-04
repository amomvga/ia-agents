import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('A variavel de ambiente DATABASE_URL e obrigatoria.');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
});

export const connectDatabase = async () => {
  await sequelize.authenticate();
};

export default sequelize;
