import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // Define a rota base para este controlador como '/users'
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register') // Define uma rota POST para '/users/register'
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created em caso de sucesso
  async register(@Body() createUserDto: { email: string; password: string }) {
    // Validação básica DTO pode ser adicionada aqui em um estágio posterior
    const user = await this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
    // Não retorne a senha, mesmo que hasheada, por segurança
    const { password, ...result } = user;
    return result;
  }
}
