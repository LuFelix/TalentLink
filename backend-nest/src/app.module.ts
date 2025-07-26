import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente acessíveis globalmente
    }),
    // Adicione esta configuração para o TypeORM e PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de banco de dados
      host: process.env.DB_HOST || 'postgres_db', // Usa DB_HOST ou 'postgres_db' (nome do serviço Docker)
      port: parseInt(process.env.DB_PORT, 10) || 5432, // Usa DB_PORT ou 5432
      username: process.env.DB_USER || 'nestjs_user', // Usa DB_USER ou 'nestjs_user'
      password: process.env.DB_PASSWORD || 'nestjs_password', // Usa DB_PASSWORD ou 'nestjs_password'
      database: process.env.DB_NAME || 'nestjs_db', // Usa DB_NAME ou 'nestjs_db'
      entities: [User], // Array onde as entidades do banco de dados serão listadas
      synchronize: false, // ATENÇÃO: Usar apenas em ambiente de desenvolvimento!
      // Sincroniza o schema do DB com suas entidades.
      // Em produção, use migrações!
      logging: true, // Opcional: Mostra as queries SQL executadas no console
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
