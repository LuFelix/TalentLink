import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator'; // Assumindo que você tem este decorator
import { Role } from '../enums/role.enum'; // Seu enum de roles
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Se não houver roles necessárias, permite acesso
    }

    const { user } = context.switchToHttp().getRequest();
    // 'user.roles' deve vir do payload do JWT e ser um array de strings (Role)
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
