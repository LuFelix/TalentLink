import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'; // Biblioteca para hash de senhas

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // Injeta o repositório do TypeORM para User
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string): Promise<User> {
    // Hashear a senha antes de salvar
    if (!password) {
      throw new BadRequestException('Password é um campo obrigatório.');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o saltRounds
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      isActive: true, // Por padrão, o novo usuário é ativo
    });

    return this.usersRepository.save(newUser);
  }
}
