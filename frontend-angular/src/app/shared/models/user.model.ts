// src/app/shared/models/user.model.ts

// Interface para o payload do token JWT decodificado
export interface DecodedToken {
  sub: string; // ID do usuário
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  // Adicionar outras propriedades que realmente vêm do seu token
}

// Interface para os dados COMPLETOs do perfil do usuário
export interface UserData {
  userId: string; // Deve vir do 'sub' do token ou de um endpoint de perfil
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePictureUrl?: string;
  roles: string[];
  // ... todas as outras propriedades do perfil que o backend fornece
}
