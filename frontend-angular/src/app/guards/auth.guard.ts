import { Injectable } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Faz o guard funcionar como "standalone"
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          console.log('AuthGuard: Usuário autenticado. Acesso permitido.');
          return true;
        } else {
          console.warn(
            'AuthGuard: Usuário NÃO autenticado. Redirecionando para login.'
          );
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  };
}
