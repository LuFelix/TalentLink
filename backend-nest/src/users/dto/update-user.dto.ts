// src/users/dto/update-user.dto.ts
import {
  IsEmail,
  IsOptional,
  MinLength,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'updated@example.com',
    description: 'Novo email do usuário',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'newpassword',
    description: 'Nova senha (deixe vazio para não alterar)',
    minLength: 6,
  })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: ['admin', 'user'],
    description: 'Novas roles do usuário',
    isArray: true,
    enum: ['admin', 'user'],
  })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiPropertyOptional({
    example: false,
    description: 'Novo status de ativação do usuário',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
