import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/user.entity'; // Importe suas entidades aqui

dotenv.config(); // Carrega variáveis de ambiente

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'nestjs_user',
  password: process.env.DB_PASSWORD || 'nestjs_password',
  database: process.env.DB_DATABASE || 'nestjs_db',
  entities: [User], // Adicione todas as suas entidades aqui
  migrations: ['./src/migrations/*.ts'], // Onde suas migrações estarão
  synchronize: false, // JAMAIS use synchronize: true em produção!
  logging: ['query', 'error'], // Para ver os SQLs gerados
});

export default AppDataSource;
