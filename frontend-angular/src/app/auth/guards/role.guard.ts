import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service'; // Importa o serviço de autenticação

@Injectable({
  providedIn: 'root', // Torna o guard disponível em toda a aplicação
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requiredRoles = route.data['roles'] as string[]; // Obtém as roles definidas na rota

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Se nenhuma role for especificada, permite o acesso (ou ajuste conforme sua política de segurança)
    }

    const user = this.authService.getLoggedInUser();

    if (
      user &&
      user.roles &&
      requiredRoles.some((role) => user.roles.includes(role))
    ) {
      return true; // Usuário está logado e possui pelo menos uma das roles necessárias
    } else {
      // Se não tem a role necessária ou não está logado, redireciona para uma página de acesso negado ou login
      // Você pode criar uma página '/access-denied' ou apenas redirecionar para o login
      this.router.navigate(['/login']); // Ou para uma página de erro/acesso negado
      return false;
    }
  }
}
