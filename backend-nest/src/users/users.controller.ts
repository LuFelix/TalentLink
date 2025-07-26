import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginationResult } from '../interfaces/pagination-result.interface.ts';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users') // Define a rota base para este controlador como '/users'
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Get() // Define uma rota GET para '/users'
  @Roles(Role.Admin) // Apenas usuários com a role 'Admin' podem acessar
  @ApiBearerAuth() // Indica ao Swagger que este endpoint requer um token JWT
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // Certifique-se que ambos os guards estão aplicados
  @Roles(Role.Admin)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationResult<any>> {
    // O retorno agora é PaginationResult
    // Delega a lógica de busca e paginação ao UsersService
    return this.usersService.findAll(page, limit);
  }
}
