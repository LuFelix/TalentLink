import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Injeta o JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Se o usuário existir e a senha for válida
      const { password, ...result } = user; // Remove a senha do objeto de retorno
      return result;
    }
    return null; // Credenciais inválidas
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles }; // Payload do JWT
    return {
      access_token: this.jwtService.sign(payload), // Gera o JWT
    };
  }
  async register(email: string, password: string) {
    // Usar o UsersService para criar o novo usuário
    // A rota pública deve criar um usuário com a role 'user' por padrão
    const newUser = await this.usersService.create(email, password, ['user']);
    return newUser;
  }
}
