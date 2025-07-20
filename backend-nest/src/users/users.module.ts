import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; // Importe a entidade User
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registra a entidade User neste módulo
  providers: [UsersService], // O serviço que conterá a lógica
  controllers: [UsersController], // O controlador para as rotas
  exports: [UsersService], // Exporta UsersService para ser usado em outros módulos (ex: AuthModule)
})
export class UsersModule {}
