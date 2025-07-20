import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Importa o guard local
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Importa o guard JWT
import { ApiTags } from '@nestjs/swagger'; // Para organizar no Swagger UI

@ApiTags('auth') // Adiciona uma tag para o Swagger UI
@Controller('auth') // Rota base para autenticação
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Protege a rota com a estratégia local
  @Post('login')
  async login(@Request() req) {
    // Após o LocalAuthGuard validar o usuário, ele estará em req.user
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard) // Protege a rota com a estratégia JWT
  @Get('profile')
  getProfile(@Request() req) {
    // Após o JwtAuthGuard validar o token, o payload estará em req.user
    return req.user;
  }
}
