// src/auth/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'; //
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    // <--- Injeção de Reflector no construtor
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verifica se a rota atual foi marcada com o decorator @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Obtém metadados do método (rota)
      context.getClass(), // Obtém metadados da classe (controlador)
    ]);

    // Se a rota for pública, permite o acesso imediatamente, pulando a autenticação JWT
    if (isPublic) {
      return true;
    }

    // Se a rota NÃO for pública, executa a lógica padrão do JwtAuthGuard (autenticação JWT)
    return super.canActivate(context);
  }
}
