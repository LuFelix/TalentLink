import 'reflect-metadata'; // Importante para o TypeORM
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity'; // Importe suas entidades aqui

// Use variáveis de ambiente para a configuração do banco de dados,
// garantindo que o TypeORM CLI possa se conectar corretamente.
// Lembre-se que o TypeORM CLI não lê o .env automaticamente como o ConfigModule do Nest.
// Você pode precisar passar essas variáveis de ambiente diretamente ao executar o comando,
// ou certificar-se de que estão definidas no ambiente do seu sistema.
// Para Docker Compose, elas podem ser definidas no service 'backend' no docker-compose.yml.
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Carrega as variáveis do arquivo .env
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost', // Use 'localhost' ou o IP do seu host se o cli estiver fora do docker
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'nestjs_user',
  password: process.env.DB_PASSWORD || 'nestjs_password',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [User], // Liste todas as suas entidades aqui
  migrations: [__dirname + '/../migrations/**/*.ts'], // Caminho para suas migrações
  synchronize: false, // SEMPRE false para migrações!
  logging: ['query', 'error'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
