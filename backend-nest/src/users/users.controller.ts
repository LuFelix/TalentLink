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
  Delete, // Importe o decorador Delete
  Param, // Importe o decorador Param
  ForbiddenException, // Importe ForbiddenException
  Req, // Importe Req para acessar o objeto request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginationResult } from '../interfaces/pagination-result.interface.ts';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Users')
@Controller('users') // Define a rota base para este controlador como '/users'
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public()
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

  @Delete(':id') // Rota DELETE para /users/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para exclusão bem-sucedida
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do usuário a ser excluído' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    // Obtenha o usuário logado do objeto de requisição (injeta pelo JwtAuthGuard)
    const requestingUser = req.user; // O req.user deve ter { userId, email, roles }

    // Logica de Autorização:
    // 1. Se o usuário logado NÃO é admin E
    // 2. Se o ID do usuário logado é diferente do ID que ele está tentando excluir
    //    Então, ele não tem permissão.
    const isAdmin =
      requestingUser.roles && requestingUser.roles.includes(Role.Admin);
    const isDeletingSelf = requestingUser.userId === id;

    if (!isAdmin && !isDeletingSelf) {
      throw new ForbiddenException(
        'You are not authorized to delete this user.',
      );
    }

    // Se a validação passou, chame o service para remover
    await this.usersService.remove(id);
  }
}
