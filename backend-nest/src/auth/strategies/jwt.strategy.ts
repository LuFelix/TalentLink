import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Para acessar variáveis de ambiente

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o JWT do cabeçalho Authorization: Bearer
      ignoreExpiration: false, // Não ignora a expiração do token
      secretOrKey: configService.get<string>('JWT_SECRET'), // Pega a chave secreta
    });
  }

  async validate(payload: any) {
    // Este método é chamado após o JWT ser validado com sucesso.
    // O 'payload' contém os dados que você assinou no JWT.
    return { userId: payload.sub, email: payload.email }; // Retorna o objeto de usuário (adiciona ao req.user)
  }
}
