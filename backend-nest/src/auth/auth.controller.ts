import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Importa o guard local
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Importa o guard JWT
import { ApiTags } from '@nestjs/swagger'; // Para organizar no Swagger UI
import { Public } from './decorators/public.decorator';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';

@ApiTags('auth') // Adiciona uma tag para o Swagger UI
@Controller('auth') // Rota base para autenticação
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

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

  @Public() // ✅ Este decorator torna a rota acessível publicamente
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;

    // 1. Verificação: Garanta que o usuário não exista
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Este e-mail já está em uso.');
    }

    // 2. Lógica de registro no AuthService
    // O AuthService usará o UsersService para criar o usuário
    const user = await this.authService.register(email, password);

    // 3. Remova a senha do retorno por segurança
    const { password: userPassword, ...result } = user;
    return result;
  }
}
