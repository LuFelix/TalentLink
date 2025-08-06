import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'; // Biblioteca para hash de senhas
import { PaginationResult } from '../interfaces/pagination-result.interface.ts';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // Injeta o repositório do TypeORM para User
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    // Pode retornar undefined se não encontrar
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async create(
    email: string,
    password: string,
    roles: string[] = ['user'],
    isActive: boolean = true,
  ): Promise<User> {
    // Hashear a senha antes de salvar
    if (!password) {
      throw new BadRequestException('Password é um campo obrigatório.');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o saltRounds
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      isActive, // Por padrão, o novo usuário é ativo
      roles,
      firstName: null,
      lastName: null,
      phone: null,
      profilePictureUrl: null,
    } as DeepPartial<User>);
    return this.usersRepository.save(newUser);
  }

  async findAll(page: number, limit: number): Promise<PaginationResult<User>> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
      select: [
        'id',
        'email',
        'isActive',
        'roles',
        'firstName',
        'lastName',
        'phone',
        'profilePictureUrl',
      ] as (keyof User)[],
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return {
      data: users,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, updateUserData: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    // Se uma nova senha for fornecida, faça o hash
    if (updateUserData.password) {
      updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
    }

    // Mescla os dados atualizados com o usuário existente
    // Uma forma alternativa simples que é mais seguro
    // do que passar o DTO diretamente, pois ele pode conter dados inválidos.
    Object.assign(user, updateUserData);

    // O TypeORM update method is more efficient for partial updates
    // await this.usersRepository.update(id, updateUserData);
    // Salva o usuário com os novos dados
    const updatedUser = await this.usersRepository.save(user);
    // Retorna o usuário atualizado (buscamos novamente para ter os dados mais recentes)
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
  }
}
