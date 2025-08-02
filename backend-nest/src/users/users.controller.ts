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
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginationResult } from '../interfaces/pagination-result.interface.ts';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users') // Define a rota base para este controlador como '/users'
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public()
  @Post('register') // Define uma rota POST para '/users/register'
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created em caso de sucesso
  async register(@Body() createUserDto: CreateUserDto) {
    // Validação básica DTO pode ser adicionada aqui em um estágio posterior
    const user = await this.usersService.create(
      createUserDto.email,
      createUserDto.password,
      createUserDto.roles,
      createUserDto.isActive,
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
    // O retorno é PaginationResult
    // Delega a lógica de busca e paginação ao UsersService
    return this.usersService.findAll(page, limit);
  }

  @Get(':id') // Rota GET para /users/:id
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do usuário a ser buscado' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const requestingUser = req.user;
    const isAdmin =
      requestingUser.roles && requestingUser.roles.includes(Role.Admin);
    const isFetchingSelf = requestingUser.userId === id;

    // Permitir que admins busquem qualquer usuário ou um usuário busque a si mesmo
    if (!isAdmin && !isFetchingSelf) {
      throw new ForbiddenException(
        'Você não tem permissão para buscar este usuário.',
      );
    }
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.'); // Importe NotFoundException
    }
    const { password, ...result } = user; // Não retorne a senha
    return result;
  }

  // --- NOVO MÉTODO: PATCH para atualizar um usuário por ID ---
  @Patch(':id') // Rota PATCH para /users/:id
  @HttpCode(HttpStatus.OK) // Retorna 200 OK
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do usuário a ser atualizado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserData: UpdateUserDto, // Use o DTO de atualização
    @Req() req,
  ) {
    const requestingUser = req.user;
    const isAdmin =
      requestingUser.roles && requestingUser.roles.includes(Role.Admin);
    const isUpdatingSelf = requestingUser.userId === id;

    // Lógica de Autorização para Update:
    // 1. Admin pode atualizar qualquer um.
    // 2. Um usuário pode atualizar a si mesmo.
    // 3. Um usuário NÃO pode atualizar as roles de ninguém (nem as suas próprias).
    // 4. Um usuário NÃO pode mudar isActive de ninguém (nem o seu próprio).
    if (!isAdmin) {
      // Se não for admin, ele só pode atualizar a si mesmo
      if (!isUpdatingSelf) {
        throw new ForbiddenException(
          'Você não tem permissão para atualizar este usuário.',
        );
      }
      // Se for um usuário comum atualizando a si mesmo,
      // ele não pode modificar 'roles' nem 'isActive'
      if (updateUserData.roles || updateUserData.isActive !== undefined) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar roles ou status de ativação.',
        );
      }
    }
    const updatedUser = await this.usersService.update(id, updateUserData);
    const { password, ...result } = updatedUser;
    return result;
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
        'Você não tem permissão de deletar esse usuário.',
      );
    }

    // Se a validação passou, chame o service para remover
    await this.usersService.remove(id);
  }
}
