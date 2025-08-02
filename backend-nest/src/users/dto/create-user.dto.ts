// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: ['user'],
    description: 'Lista de roles do usuário',
    isArray: true,
    enum: ['admin', 'user'],
    default: ['user'],
  })
  @IsOptional() // Opcional para o registro público, mas admins podem especificar
  @IsArray()
  roles?: string[];

  @ApiProperty({
    example: true,
    description: 'Status de ativação do usuário',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
