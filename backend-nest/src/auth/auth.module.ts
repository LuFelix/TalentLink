import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importa UsersModule para usar UsersService
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Para acessar variáveis de ambiente
import { LocalStrategy } from './strategies/local.strategy'; // Estratégia de login local
import { JwtStrategy } from './strategies/jwt.strategy'; // Estratégia de validação JWT

@Module({
  imports: [
    UsersModule, // Necessário para acessar o UsersService
    PassportModule, // Integração com Passport.js
    JwtModule.registerAsync({
      // Configuração assíncrona para JWT
      imports: [ConfigModule], // Importa ConfigModule para injetar ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Pega a chave secreta do ambiente
        signOptions: { expiresIn: '60s' }, // Token expira em 60 segundos (ajustar para mais em prod)
      }),
      inject: [ConfigService], // Injeta ConfigService
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], // Serviços e estratégias de autenticação
  controllers: [AuthController], // Controlador para rotas de autenticação (ex: /auth/login)
})
export class AuthModule {}
